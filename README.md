# Vue Mutable Grid Layout

Vue Mutable Grid Layout is a simple flexible and dynamic grid layout system for Vue.js, ideal for creating draggable and mutable grid layouts. Currently v1 is only functional with single slot items. Later features aim to add multi-slot items, row/col individual sizing, hover with dynamic shifting/inserting, and more. 

## Installation

```bash
npm install vue-mutable-grid-layout
```


## Usage
Import GridLayout and GridModule in your Vue component:
```js
import GridLayout from 'vue-mutable-grid-layout';

export default {
  components: {
    GridLayout
  }
  // ...rest of code
};

```

**A more detailed example/usage can be seen below

## Props

| Prop                   | Type                      | Required | Default      | Description                                           |
|------------------------|---------------------------|----------|--------------|-------------------------------------------------------|
| `items`                | Array                     | No       | `[]`         | Array of items to be displayed in the grid.           |
| `cols`                 | Number                    | No       | `3`          | Number of columns in the grid.                        |
| `rows`                 | Number                    | No       | `2`          | Number of rows in the grid.                           |
| `gridWidth`            | String, Number            | No       | `"100%"`     | Width of the grid. (number is in px)                                   |
| `gridHeight`           | String, Number            | No       | `"100%"`     | Height of the grid.    (number is in px)                               |
| `itemGap`              | Number                    | No       | `15`         | Gap between grid items.                               |
| `highlightCellOnMove`  | Boolean                   | No       | `true`       | Flag to highlight cells on item move.                 |
| `highlightOnMoveClass` | String                    | No       | `"highlighted-cell"` | Class to apply when highlighting cells. |
| `borderRadius`         | Number                    | No       | `0`          | Border radius for grid items.                         |
| `showScrollOnOverflow` | Boolean                   | No       | `true`       | Flag to show custom scrollbars.                       |

## Items Prop  ---- ***please read***
##### each item will want to have either a component or a rawHTML prop passed to it.
&nbsp;

| Prop                   | Type                      | Required | Default      | Description                                           |
|------------------------|---------------------------|----------|--------------|-------------------------------------------------------|
| `component`            | Object                    | No       | null         | Make sure to use `markRaw` for your component         |
| `props`            | Object                    | No       | null         |  If passing in a component, pass the props for it here         |
| `rawHTML`              | String                    | No       | null         | Option to pass in raw HTML rather than a component.   |

## Events

| Event               | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `updatedItemsList`  | Emitted when the list of items is updated (e.g., after a drag-and-drop).     |
| `updateItem`        | Emitted when a single item's position is updated.                            |
| `itemDragStart`     | Emitted when the dragging of an item starts.                                 |
| `itemDragEnd`       | Emitted when the dragging of an item ends.                                   |


## Example
Here is a simple example of how to use Vue Mutable Grid Layout:

```html
<template>
  <GridLayout
    :items="gridItems"
    :cols="3"
    :rows="2"
    :gridWidth="1000"
    :gridHeight="800"
    showErrorToast
    :itemGap="5"
    :borderRadius="5"
    :showScroll="true"
    highlightCellOnMove
    @updatedItemsList="handleUpdateItems"
  >
    <template v-slot="{ item }">
      <div>
        <div v-if="item.id === 1" v-html="getCurrent12hrTime"></div>
      </div>
    </template>
  </GridLayout>
  <button @click="getAndSetFromStorage">SET FROM STORAGE</button>
</template>

<script>
// Import the GridLayout component
import GridLayout from 'vue-mutable-grid-layout';
import { markRaw } from 'vue';

export default {
  components: { GridLayout },
  data() {
    return {
      // Define your grid items here
      gridItems: [
        { id: 1, component: markRaw(<YourComonent>), props: {<PropsForPAssedInComponment>}, color: "red", customClass: 'my-custom-class', customStyle: { color: 'yellow', fontSize: '20px' } },
        { id: 1, rawHTML: this.returnTest(),  },
        // ... other items
      ],
    };
  },
  methods: {
    handleUpdateItems(updatedItemList) {
      // Handle the updated items list
      this.gridItems = updatedItemList;
    },
     returnTest() {
  return `
    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 8px; background-color: #f9f9f9;">
      <h1 style="color: #333; text-align: center;">Welcome to Test Container</h1>
      <p style="color: #666;">This is a test paragraph with some sample text.</p>
      <ul style="list-style-type: none; padding: 0;">
        <li style="margin-bottom: 5px; color: #555;">Item 1</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 2</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 3</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 1</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 2</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 3</li>
        <br />
            <li style="margin-bottom: 5px; color: #555;">Item 1</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 2</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 3</li>
        <br />
            <li style="margin-bottom: 5px; color: #555;">Item 1</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 2</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 3</li>
        <br />
            <li style="margin-bottom: 5px; color: #555;">Item 1</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 2</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 3</li>
        <br />
            <li style="margin-bottom: 5px; color: #555;">Item 1</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 2</li>
        <br />
        <li style="margin-bottom: 5px; color: #555;">Item 3</li>
        <br />
      </ul>
      <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor  : pointer;">
        Click Me
      </button>
      <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
        <span style="color: #999;">Footer Information</span>
      </div>
    </div>
  `;
}
  },
};
</script>

```

## Contributing
Contributions to Vue Mutable Grid Layout are welcome. Please ensure that your code follows the existing style and that all tests pass.

## License
Vue Mutable Grid Layout is MIT licensed.