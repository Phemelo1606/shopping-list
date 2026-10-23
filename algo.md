# Algorithm Design

## 1. Application Flow

The shopping list app follows a simple user-driven flow:

1. User loads the application.
2. If no valid session exists, the app redirects to the login page.
3. If user is new, they can navigate to the registration page.
4. After successful authentication, the user is redirected to the home page.
5. On the home page, the user can:
   - add shopping lists/items,
   - update existing entries,
   - delete entries,
   - search by item name,
   - sort by name, category, or date.
6. The profile page allows the user to view and change account information.
7. The app stores data in JSON Server and keeps Redux as the single source of truth.

## 2. Authentication Algorithm

```text
START
  LOAD app
  CHECK local session or persisted login state

  IF user is logged in THEN
    ALLOW access to protected routes
  ELSE
    REDIRECT to Login page
  ENDIF

  IF user submits registration form THEN
    VALIDATE required fields
    HASH password
    SAVE user to database
    DISPLAY success message
    REDIRECT to Login page
  ENDIF

  IF user submits login form THEN
    FETCH users from database
    COMPARE submitted email and decrypted/hashed password
    IF valid THEN
      SAVE session in local storage or Redux state
      REDIRECT to Home page
    ELSE
      DISPLAY error message
    ENDIF
  ENDIF
END
```

## 3. Protected Routing Algorithm

```text
START
  READ current route
  READ login status from Redux or storage

  IF route is protected AND user is not logged in THEN
    REDIRECT to /login
  ENDIF

  IF user is logged in AND route is login/register THEN
    REDIRECT to /home
  ENDIF
END
```

## 4. Shopping List CRUD Algorithm

### Create

```text
START
  GET input values from form
  VALIDATE required fields
  IF fields are valid THEN
    CREATE new shop item/list object
    APPEND to Redux state
    SEND POST request to JSON Server
    DISPLAY success notification
  ELSE
    DISPLAY validation message
  ENDIF
END
```

### Read

```text
START
  FETCH shopping list data from JSON Server
  DISPATCH data to Redux store
  RENDER list on Home page
END
```

### Update

```text
START
  USER selects item to edit
  POPULATE form with existing values
  USER updates fields
  VALIDATE input
  IF valid THEN
    UPDATE item in Redux state
    SEND PUT/PATCH request to JSON Server
    DISPLAY update notification
  ENDIF
END
```

### Delete

```text
START
  USER clicks delete button
  CONFIRM action if required
  REMOVE item/list from Redux state
  SEND DELETE request to JSON Server
  UPDATE list view
END
```

## 5. Search and Sort Algorithm

```text
START
  READ current URL search params
  GET search keyword and sort value

  FILTER current shopping list items by item name containing keyword
  SORT filtered results by:
    - name ascending/descending
    - category ascending/descending
    - date added newest/oldest

  UPDATE the visible list
  UPDATE the URL query string
END
```

### Query Parameter Rules

- Search value is stored in URL as `?search=milk`
- Sort value is stored in URL as `?sort=name` or `?sort=category`
- When the URL changes, the page re-renders and updates the Redux state accordingly.

## 6. State Management Algorithm

```text
START
  INITIALIZE Redux store
  STORE user session data
  STORE shopping list data
  STORE UI states like loading, errors, and notifications

  WHEN API call begins THEN
    SET loading = true
  WHEN API succeeds THEN
    UPDATE state with returned data
    SET loading = false
  WHEN API fails THEN
    SET error message
    SET loading = false
  ENDIF
END
```

## 7. Profile Management Algorithm

```text
START
  FETCH current logged-in user details
  DISPLAY profile information in form

  IF user edits profile THEN
    VALIDATE new data
    UPDATE Redux state
    SAVE to JSON Server
    SHOW success alert
  ENDIF

  IF user updates login credentials THEN
    VALIDATE email and password rules
    HASH password
    UPDATE user record
    DISPLAY confirmation
  ENDIF
END
```

## 8. Responsive UI Algorithm

```text
START
  READ viewport width

  IF width is mobile-sized THEN
    USE stacked layout and compact components
  ELSE IF width is tablet-sized THEN
    USE balanced two-column layout
  ELSE
    USE full desktop layout with side navigation and larger cards
  ENDIF
END
```

## 9. Notification & Error Handling

```text
START
  WHEN action succeeds THEN
    DISPLAY success toast/alert
  WHEN action fails THEN
    DISPLAY error toast/alert
  WHEN validation fails THEN
    SHOW inline validation messages
  ENDIF
END
```

## 10. Final Application Logic Summary

The complete app works as follows:

1. User registers or logs in.
2. App validates the session.
3. Redux stores auth and shopping data.
4. JSON Server persists data.
5. User performs CRUD actions.
6. Search and sort use URL parameters.
7. UI updates in real time with notifications.
8. The system remains responsive across screen sizes.

This design ensures a clean, maintainable, and task-compliant shopping list application.
