<template>
  <div
    class="grid-module"
    :class="customClass"
    :style="moduleStyle"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @scroll="handleScroll"
    :id="`grid-module-id-${id}`"
  >
    <slot></slot>
    <div
      :id="`grid-module-scrollbar-${id}`"
      class="custom-scrollbar"
      :style="scrollbarStyle"
      v-show="isScrollbarVisible && showScroll"
    ></div>
  </div>
</template>

<script>
export default {
  name: "GridModule",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "#000333",
    },
    position: {
      type: Object,
      required: true,
    },
    customClass: {
      type: String,
      default: "",
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    },
    borderRadius: {
      type: Number,
      default: 8,
    },
    showScroll: {
      type: Boolean,
      default: true,
    },
    scrollColor: {
      type: String,
      default: "#000",
    },
    size: {
      type: Object,
      default: () => ({ width: 1, height: 1 }),
    },
  },
  data() {
    return {
      scrollbarTop: 0,
      scrollbarHeight: 20,
      isScrollbarVisible: false,
      scrollbarTimeoutId: null,
    };
  },
  computed: {
    moduleStyle() {
      return {
        ...this.customStyle,
        gridColumnStart: this.position.x + 1,
        gridColumnEnd: `span ${this.size.width}`,
        gridRowStart: this.position.y + 1,
        gridRowEnd: `span ${this.size.height}`,
        backgroundColor: this.backgroundColor,
        overflow: "auto",
        borderRadius: `${this.borderRadius}px`,
      };
    },
    scrollbarStyle() {
      return {
        top: this.scrollbarTop + "px",
        height: this.scrollbarHeight + "px",
      };
    },
  },
  methods: {
    dragStart(event) {
      this.$emit("itemDragStart", {
        id: this.id,
        position: this.position,
        size: this.size,
      });
    },
    dragEnd(event) {
      this.$emit("itemDragEnd");
    },
    handleScroll(event) {
      const element = event.target;
      const scrollbar = document.getElementById(
        `grid-module-scrollbar-${this.id}`
      );
      scrollbar.style.opacity = "1";

      // Calculate the scroll percentage
      const scrollPercentage =
        element.scrollTop / (element.scrollHeight - element.clientHeight);

      // Adjusted calculation for scrollbarTop
      this.scrollbarTop =
        scrollPercentage *
          (element.scrollHeight - element.clientHeight - this.scrollbarHeight) +
        element.clientHeight * scrollPercentage;

      if (this.scrollbarTimeoutId) {
        clearTimeout(this.scrollbarTimeoutId);
      }

      this.scrollbarTimeoutId = setTimeout(() => {
        scrollbar.style.opacity = "0"; // Fade out scrollbar
      }, 800);
    },
    updateScrollbar() {
      const element = this.$el;
      this.scrollbarHeight =
        (element.clientHeight / element.scrollHeight) * element.clientHeight;
      this.isScrollbarVisible = element.scrollHeight > element.clientHeight;
    },
  },
  mounted() {
    this.updateScrollbar();
    this.$el.style.setProperty("--scrollColor", this.scrollColor);
  },
};
</script>

<style scoped>
.grid-module {
  position: relative;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  &::-ms-scrollbar {
    display: none;
  }
}

.custom-scrollbar {
  position: absolute;
  right: 0;
  width: 10px;
  border-radius: 5px;
  background-color: var(--scrollColor);
  opacity: 0;
  transition: opacity 0.5s ease;
}
</style>
