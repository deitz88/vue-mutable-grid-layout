<template>
  <div class="grid-layout" @dragover.prevent @drop="onDrop" :style="gridStyle">
    <div
      v-if="error"
      class="grid-error-container"
      :style="`width: ${normalizeSize(gridWidth)}; height: ${normalizeSize(
        gridHeight
      )}`"
    >
      <div class="grid-error-message">{{ error }}</div>
    </div>
    <GridModule
      v-for="(item, index) in processedItems"
      v-else
      :key="item.id"
      :customClass="item.customClass"
      :customStyle="item.customStyle"
      :id="item.id"
      :backgroundColor="item.backgroundColor"
      :position="{ x: item.x, y: item.y }"
      :size="{ width: item.width, height: item.height }"
      :itemGap="itemGap"
      :showScrollOnOverflow="showScrollOnOverflow"
      :class="[isCellHighlighted(item) ? highlightOnMoveClass : '']"
      :borderRadius="borderRadius"
      @itemDragStart="itemDragStart(item)"
      @itemDragEnd="itemDragEnd"
      @dragenter="onItemHoverStart($event, { x: item.x, y: item.y })"
      @dragleave="onItemHoverEnd($event, { x: item.x, y: item.y })"
      @drop="onItemHoverEnd($event, { x: item.x, y: item.y })"
    >
      <div v-if="item.rawHTML" v-html="item.rawHTML"></div>

      <component
        v-else-if="item.component"
        :is="item.component"
        v-bind="item.props"
      >
        <template>
          <slot :item="item" :index="index"></slot>
        </template>
      </component>
    </GridModule>
  </div>
</template>


<script>
import { markRaw, shallowRef } from "vue";
import GridModule from "./GridModule.vue";

export default {
  name: "GridLayout",
  components: {
    GridModule,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    cols: {
      type: Number,
      default: 3,
    },
    rows: {
      type: Number,
      default: 2,
    },
    gridWidth: {
      type: [String, Number],
      default: "100%",
    },
    gridHeight: {
      type: [String, Number],
      default: "100%",
    },
    itemGap: {
      type: Number,
      default: 15,
    },
    highlightCellOnMove: {
      type: Boolean,
      default: true,
    },
    highlightOnMoveClass: {
      type: String,
      default: "highlighted-cell",
    },
    borderRadius: {
      Type: Number,
      default: 0,
      required: false,
    },
    showScrollOnOverflow: {
      Type: Boolean,
      default: true,
    },
    beta__cellSize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      draggingItem: null,
      originalCell: null,
      hoveredCell: null,
      error: null,
      inactiveItems: undefined,
      itemsRef: shallowRef([]),
    };
  },
  computed: {
    gridStyle() {
      return {
        width: this.normalizeSize(this.gridWidth),
        height: this.normalizeSize(this.gridHeight),
        gridTemplateColumns: `repeat(${this.cols}, 1fr)`,
        gridTemplateRows: `repeat(${this.rows}, 1fr)`,
        gap: `${this.itemGap}px`,
      };
    },
    processedItems() {
      this.error = null;
      let isValid = true;
      const mapped = this.items.map((item) => {
        if (typeof item.active !== "boolean" || !item.id) {
          isValid = false;
        }
        return { ...item, active: item.active ? item.active : false };
      });
      if (!isValid) {
        this.error = `Identification Error`;
        console.error("each item must have an id and an active boolean.");
        return;
      }
      const activeItems = mapped.filter((item) => item.active !== false);

      if (activeItems.length > this.cols * this.rows) {
        this.error = `Overflow Error`;
        console.error(
          `Too many active items. \n cols: ${this.cols} \n rows: ${
            this.rows
          } \n there are ${
            this.cols * this.rows
          } total slots with your current configuration. \n ${
            activeItems.length
          } active items were passed. \n # of active items must be equal or less to than the amount of total slots.
          `
        );
        return;
      } else {
        this.error = null;
        this.inactiveItems = this.items.filter((item) => item.active === false);
        const itemsWithAssignedPositions = activeItems.map((item, index) => {
          const id = item.id || `item-${index}`;
          const x =
            item.active && item.x !== undefined
              ? item.x
              : item.active
              ? index % this.cols
              : null;
          const y =
            item.active && item.y !== undefined
              ? item.y
              : item.active
              ? Math.floor(index / this.cols)
              : null;
          return {
            ...item,
            id,
            x,
            y,
            width: this.beta__cellSize && item.width ? item.width : 1,
            height: this.beta__cellSize && item.height ? item.height : 1,
          };
        });

        return itemsWithAssignedPositions.sort((a, b) => {
          if (a.y === b.y) {
            return a.x - b.x;
          }
          return a.y - b.y;
        });
      }
    },
  },
  created() {
    this.updateItems(this.items);
  },
  watch: {
    items(newItems) {
      this.updateItems(newItems);
    },
  },
  methods: {
    normalizeSize(value) {
      return typeof value === "number" ? `${value}px` : value;
    },
    updateItems(newItems) {
      this.itemsRef.value = newItems.map((item) => {
        if (item.component) {
          item.component = markRaw(item.component);
        }
        return item;
      });
    },
    itemDragStart(item) {
      this.draggingItem = item;
      this.originalCell = { x: item.x, y: item.y };
      this.hoveredCell = null;
    },

    itemDragEnd() {
      this.draggingItem = null;
      this.originalCell = null;
      this.hoveredCell = null;
    },

    onItemHoverStart(event, cell) {
      setTimeout(() => {
        if (
          this.draggingItem &&
          !(cell.x === this.originalCell.x && cell.y === this.originalCell.y)
        ) {
          this.hoveredCell = cell;
        }
      }, 10);
    },

    onItemHoverEnd(event, cell) {
      this.hoveredCell = null;
    },

    isCellHighlighted(cell) {
      if (!this.highlightCellOnMove || !this.hoveredCell) {
        return false;
      }
      return this.hoveredCell.x === cell.x && this.hoveredCell.y === cell.y;
    },
    onDrop(event) {
      if (!this.draggingItem) {
        console.warn("No item is being dragged.");
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const gridX = Math.floor(x / (rect.width / this.cols));
      const gridY = Math.floor(y / (rect.height / this.rows));
      const newPosition = { x: gridX, y: gridY };

      const validMove = this.isPositionValid(newPosition, this.draggingItem);
      const isOccupied = this.isSpotOccupied(newPosition, this.draggingItem);
      const canSwap = isOccupied.overlap ? this.canSwapItems() : false;
      if (!validMove) {
        console.warn(
          "Not a valid move, going out of bounds for col/row of layout."
        );
      }

      if (validMove && isOccupied && !isOccupied.overlap) {
        this.moveItem(this.draggingItem, newPosition);
        this.updatedItems(this.items);
      } else if (validMove && isOccupied.overlap && !canSwap) {
        console.warn(
          `Cannot swap item ${this.draggingItem.id}. Dropped at x=${gridX}, y=${gridY}, likely no spaces`
        );
      } else if (validMove && isOccupied.overlap && canSwap) {
        if (!isOccupied.item || !isOccupied.otherItem) {
          console.warn("No items to compare were returned from isOccupied");
        } else {
          this.swapPositions(isOccupied.item, isOccupied.otherItem);
        }
      } else {
        console.warn(
          `Invalid move for item ${this.draggingItem.id}. Dropped at x=${gridX}, y=${gridY}`
        );
      }

      this.draggingItem = null;
    },
    canSwapItems() {
      //TODO: this will incorperate where the multi-cell will be added later
      return true;
    },
    isPositionValid(newPosition, item) {
      const rightEdge = newPosition.x + item.width - 1;
      const bottomEdge = newPosition.y + item.height - 1;

      const isValid = rightEdge <= this.cols - 1 && bottomEdge - 1 <= this.rows;
      if (!isValid) {
        console.warn(
          `Invalid position for item ${item.id}. New position: x=${newPosition.x}, y=${newPosition.y}, rightEdge=${rightEdge}, bottomEdge=${bottomEdge}`
        );
      }
      return isValid;
    },
    isSpotOccupied(newPosition, item) {
      let sameSpot;
      for (const otherItem of this.processedItems) {
        if (otherItem.id === item.id) {
          sameSpot = true;
        }

        const occupiedXRange = [otherItem.x, otherItem.x + otherItem.width - 1];
        const occupiedYRange = [
          otherItem.y,
          otherItem.y + otherItem.height - 1,
        ];
        const newItemXRange = [newPosition.x, newPosition.x + item.width - 1];
        const newItemYRange = [newPosition.y, newPosition.y + item.height - 1];
        const overlap =
          this.rangesOverlap(occupiedXRange, newItemXRange) &&
          this.rangesOverlap(occupiedYRange, newItemYRange);

        if (overlap) {
          return {
            overlap: true,
            msg: `Overlap detected for item ${item.id} with item ${otherItem.id}.`,
            item: item,
            otherItem: otherItem,
          };
        }
      }

      return {
        overlap: false,
        msg: "No overlap detected",
        item: item,
        otherItem: null,
        sameSpot: sameSpot ?? false,
      };
    },

    rangesOverlap(range1, range2) {
      return range1[1] >= range2[0] && range1[0] <= range2[1];
    },

    swapPositions(item1, item2) {
      // Creating a copy of the processed items
      let updatedItems = [...this.processedItems];

      // Finding the items in the processed list
      let foundItem1 = updatedItems.find((item) => item.id === item1.id);
      let foundItem2 = updatedItems.find((item) => item.id === item2.id);

      if (foundItem1 && foundItem2) {
        // Check if height and width are the same
        if (
          foundItem1.height === foundItem2.height &&
          foundItem1.width === foundItem2.width
        ) {
          // Swapping x and y coordinates
          [foundItem1.x, foundItem2.x] = [foundItem2.x, foundItem1.x];
          [foundItem1.y, foundItem2.y] = [foundItem2.y, foundItem1.y];
        }

        // Emit the updated items list
        this.$emit("updatedItemsList", [
          ...updatedItems,
          ...this.inactiveItems,
        ]);
      }
    },

    moveItem(movedItem, newPosition) {
      let updatedItems = JSON.parse(JSON.stringify(this.items));
      const itemIndex = updatedItems.findIndex(
        (item) => item.id === movedItem.id
      );
      if (itemIndex !== -1) {
        updatedItems[itemIndex].x = newPosition.x;
        updatedItems[itemIndex].y = newPosition.y;
      }
      let updatedItem = { ...movedItem, x: newPosition.x, y: newPosition.y };
      this.$emit("updateItem", updatedItem);
      this.$emit("updatedItemsList", [...updatedItems, ...this.inactiveItems]);
    },
  },
};
</script>

<style scoped>
.grid-layout {
  display: grid;
  width: 100%;
  height: 100%;
}

.highlighted-cell {
  box-shadow: 0px 0px 15px 5px rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  background-color: white;
  transition: box-shadow 0.1s ease;
}
.grid-error-container {
  display: grid;
  align-items: center;
}
.grid-error-message {
  padding: 1rem 2rem;
  width: fit-content;
  margin: auto;
  border-radius: 8px;
  box-shadow: 0px 1px 10px 1px rgba(255, 255, 255, 0.4);
}
</style>

