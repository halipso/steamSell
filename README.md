# steamSell
Node.js library for selling items on Steam Marketplace

# Installation

```js
var steamSell = require('./steamSell/index.js');
```

# Usage
Instantiate a instagram object...

```js
var sell = new steamSell();
```

...then setup session with Steam cookies:

```js
sell.setCookies('cookies');
```

You can use DoctorMcKay's Steam Community library to get cookies and load your inventory.

# Methods

## sellItem(item, price, steamid, callback)

- `item` - Steam item object containing appid, contextid and id
- `price` - Price in cents
- `steamid` - The 64-bit representation of your Steam id. **Note:** use [steamid](https://www.npmjs.com/package/steamid) library.
- `callback` - Required. Called when the requested data is available.
  - `err` - `null` on success, an `Error` object on failure

## cancelListing(listing, callback)

- `listing` - id of the listing
- `callback` - Required. Called when the requested data is available.
  - `err` - `null` on success, an `Error` object on failure

## getListings(callback)

- `callback` - Required. Called when the requested data is available.
  - `err` - `null` on success, an `Error` object on failure
  - `listings` - An array containing all active listings

