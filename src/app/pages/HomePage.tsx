import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addItem,
  createList,
  deleteItem,
  deleteList,
  fetchLists,
  renameList,
  shareList,
  unshareList,
  updateItem,
} from "../../features/lists/listsSlice";
import type { ShoppingItem } from "../../features/lists/listsSlice";
import { useToast } from "../toast";
import { getErrorMessage } from "../utils/api";
import { CATEGORY_OPTIONS } from "../utils/categories";
import { filterAndSortItems, isSortKey, SORT_OPTIONS } from "../utils/sortItems";
import type { SortKey } from "../utils/sortItems";
import Button from "../components/Button/Button";
import SearchBar from "../components/SearchBar/SearchBar";
import SelectInput from "../components/SelectInput/SelectInput";
import ItemCard from "../components/ItemCard/ItemCard";
import ProgressCard from "../components/ProgressCard/ProgressCard";
import EmptyState from "../components/EmptyState/EmptyState";
import Spinner from "../components/Spinner/Spinner";
import ListTabs from "../components/ListTabs/ListTabs";
import ItemFormModal from "../components/ItemFormModal/ItemFormModal";
import type { ItemFormValues } from "../components/ItemFormModal/ItemFormModal";
import ListFormModal from "../components/ListFormModal/ListFormModal";
import ShareListModal from "../components/ShareListModal/ShareListModal";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import "./HomePage.css";

// Only one dialog is ever open, so a single piece of state describes it.
type Dialog =
  | { type: "addItem" }
  | { type: "editItem"; item: ShoppingItem }
  | { type: "deleteItem"; item: ShoppingItem }
  | { type: "newList" }
  | { type: "renameList" }
  | { type: "deleteList" }
  | { type: "share" }
  | null;

const ALL_CATEGORIES = "all";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const notify = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const { lists, items, status } = useAppSelector((state) => state.lists);
  const [dialog, setDialog] = useState<Dialog>(null);

  // The URL is the source of truth for the active list, search, sort and category,
  // so editing it (or using back/forward) updates the page automatically.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const sort: SortKey = isSortKey(sortParam) ? sortParam : "date";
  const category = searchParams.get("category") ?? ALL_CATEGORIES;
  const listParam = Number(searchParams.get("list"));

  const userId = user?.id;
  const userEmail = user?.email;

  useEffect(() => {
    if (userId !== undefined && userEmail) {
      dispatch(fetchLists({ userId, email: userEmail }));
    }
  }, [dispatch, userId, userEmail]);

  const activeList = lists.find((list) => list.id === listParam) ?? lists[0];
  const isOwner = activeList !== undefined && activeList.userId === userId;

  const listItems = useMemo(
    () => items.filter((item) => item.listId === activeList?.id),
    [items, activeList?.id]
  );
  const visibleItems = useMemo(
    () => filterAndSortItems(listItems, { query, category, sort }),
    [listItems, query, category, sort]
  );
  const boughtCount = listItems.filter((item) => item.bought).length;
  const hasFilters = query.trim() !== "" || category !== ALL_CATEGORIES;

  if (!user) return null;

  // ---- URL helpers --------------------------------------------------------

  // Merges changes into the existing params; null or "" removes a param.
  const updateParams = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const selectList = (listId: number) => {
    // Switching lists clears the old search and category filter, but keeps the sort.
    updateParams({ list: String(listId), q: null, category: null });
  };

  const clearFilters = () => updateParams({ q: null, category: null });

  // ---- Actions ------------------------------------------------------------

  // Runs a request, shows a toast either way, and tells the caller if it worked.
  const run = async (request: () => Promise<unknown>, successMessage: string) => {
    try {
      await request();
      notify("success", successMessage);
      return true;
    } catch (error) {
      notify("error", getErrorMessage(error));
      return false;
    }
  };

  const handleCreateList = async (name: string) => {
    try {
      const created = await dispatch(createList({ userId: user.id, name })).unwrap();
      notify("success", `"${created.name}" created.`);
      setDialog(null);
      selectList(created.id);
    } catch (error) {
      notify("error", getErrorMessage(error));
    }
  };

  const handleRenameList = async (name: string) => {
    if (!activeList) return;
    const ok = await run(
      () => dispatch(renameList({ id: activeList.id, name })).unwrap(),
      "List renamed."
    );
    if (ok) setDialog(null);
  };

  const handleDeleteList = async () => {
    if (!activeList) return;
    const itemIds = listItems.map((item) => item.id);
    const ok = await run(
      () => dispatch(deleteList({ id: activeList.id, itemIds })).unwrap(),
      `"${activeList.name}" deleted.`
    );
    if (ok) {
      setDialog(null);
      updateParams({ list: null, q: null, category: null });
    }
  };

  const handleShare = async (email: string) => {
    if (!activeList) return false;
    return run(
      () =>
        dispatch(
          shareList({
            listId: activeList.id,
            email,
            sharedWith: activeList.sharedWith,
            ownerEmail: user.email,
          })
        ).unwrap(),
      "List shared."
    );
  };

  const handleUnshare = async (email: string) => {
    if (!activeList) return;
    await run(
      () =>
        dispatch(
          unshareList({ listId: activeList.id, email, sharedWith: activeList.sharedWith })
        ).unwrap(),
      "Access removed."
    );
  };

  const handleAddItem = async (values: ItemFormValues) => {
    if (!activeList) return;
    const ok = await run(
      () =>
        dispatch(
          addItem({
            userId: user.id,
            listId: activeList.id,
            name: values.name,
            quantity: values.quantity,
            category: values.category,
            notes: values.notes,
            imageUrl: values.imageUrl,
          })
        ).unwrap(),
      `${values.name.trim()} added.`
    );
    if (ok) setDialog(null);
  };

  const handleEditItem = async (item: ShoppingItem, values: ItemFormValues) => {
    const ok = await run(
      () =>
        dispatch(
          updateItem({
            id: item.id,
            changes: {
              name: values.name.trim(),
              quantity: values.quantity,
              category: values.category,
              notes: values.notes.trim(),
              imageUrl: values.imageUrl ?? "",
            },
          })
        ).unwrap(),
      "Item updated."
    );
    if (ok) setDialog(null);
  };

  const handleToggleBought = (item: ShoppingItem) => {
    run(
      () => dispatch(updateItem({ id: item.id, changes: { bought: !item.bought } })).unwrap(),
      item.bought ? `${item.name} moved back to your list.` : `${item.name} ticked off.`
    );
  };

  const handleDeleteItem = async (item: ShoppingItem) => {
    const ok = await run(() => dispatch(deleteItem(item.id)).unwrap(), `${item.name} deleted.`);
    if (ok) setDialog(null);
  };

  //  Rendering

  const renderBody = () => {
    if (status === "loading" && lists.length === 0) {
      return (
        <div className="home-loading">
          <Spinner size="lg" label="Loading your lists" />
        </div>
      );
    }

    if (status === "failed") {
      return (
        <EmptyState
          title="Couldn't load your lists"
          message="Check that json-server is running, then try again."
          action={
            <Button onClick={() => dispatch(fetchLists({ userId: user.id, email: user.email }))}>
              Try again
            </Button>
          }
        />
      );
    }

    if (!activeList) {
      return (
        <EmptyState
          title="No lists yet"
          message="Create your first shopping list to start adding items."
          action={<Button onClick={() => setDialog({ type: "newList" })}>Create a list</Button>}
        />
      );
    }

    return (
      <>
        <ProgressCard bought={boughtCount} total={listItems.length} />

        <div className="home-toolbar">
          <div className="home-search">
            <SearchBar
              value={query}
              onChange={(value) => updateParams({ q: value })}
              placeholder="Search items by name…"
            />
          </div>
          <SelectInput
            compact
            ariaLabel="Filter by category"
            value={category}
            options={[{ value: ALL_CATEGORIES, label: "All categories" }, ...CATEGORY_OPTIONS]}
            onChange={(event) =>
              updateParams({ category: event.target.value === ALL_CATEGORIES ? null : event.target.value })
            }
          />
          <SelectInput
            compact
            ariaLabel="Sort items"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(event) => updateParams({ sort: event.target.value })}
          />
        </div>

        {listItems.length === 0 ? (
          <EmptyState
            title="This list is empty"
            message="Add what you need to buy and tick things off as you shop."
            action={<Button onClick={() => setDialog({ type: "addItem" })}>Add an item</Button>}
          />
        ) : visibleItems.length === 0 ? (
          <EmptyState
            title="Nothing matches"
            message="No items match your search or category filter."
            action={
              hasFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="home-grid">
            {visibleItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggleBought={handleToggleBought}
                onEdit={(selected) => setDialog({ type: "editItem", item: selected })}
                onDelete={(selected) => setDialog({ type: "deleteItem", item: selected })}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-heading">
          <p className="home-eyebrow">Hi, {user.name}</p>
          <h1 className="home-title">{activeList ? activeList.name : "Your shopping lists"}</h1>
        </div>
        {activeList && (
          <div className="home-actions">
            {isOwner && (
              <>
                <Button variant="secondary" size="sm" onClick={() => setDialog({ type: "share" })}>
                  Share
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDialog({ type: "renameList" })}
                >
                  Rename
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDialog({ type: "deleteList" })}
                >
                  Delete list
                </Button>
              </>
            )}
            <Button onClick={() => setDialog({ type: "addItem" })}>Add item</Button>
          </div>
        )}
      </header>

      {lists.length > 0 && (
        <ListTabs
          lists={lists}
          activeListId={activeList?.id}
          currentUserId={user.id}
          onSelect={selectList}
          onCreate={() => setDialog({ type: "newList" })}
        />
      )}

      {renderBody()}

      {/* Dialogs are mounted only while open, so each one starts with fresh form state. */}
      {dialog?.type === "addItem" && (
        <ItemFormModal onSubmit={handleAddItem} onClose={() => setDialog(null)} />
      )}
      {dialog?.type === "editItem" && (
        <ItemFormModal
          item={dialog.item}
          onSubmit={(values) => handleEditItem(dialog.item, values)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "deleteItem" && (
        <ConfirmModal
          title="Delete item?"
          message={`"${dialog.item.name}" will be removed from this list.`}
          onConfirm={() => handleDeleteItem(dialog.item)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "newList" && (
        <ListFormModal onSubmit={handleCreateList} onClose={() => setDialog(null)} />
      )}
      {dialog?.type === "renameList" && activeList && (
        <ListFormModal
          initialName={activeList.name}
          onSubmit={handleRenameList}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "deleteList" && activeList && (
        <ConfirmModal
          title="Delete list?"
          message={`"${activeList.name}" and its ${listItems.length} ${
            listItems.length === 1 ? "item" : "items"
          } will be deleted for you and anyone it's shared with. This can't be undone.`}
          confirmLabel="Delete list"
          onConfirm={handleDeleteList}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "share" && activeList && (
        <ShareListModal
          listName={activeList.name}
          sharedWith={activeList.sharedWith}
          onShare={handleShare}
          onUnshare={handleUnshare}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
