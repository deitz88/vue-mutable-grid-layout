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
        <div v-if="item.id === 2" v-html="returnTest()"></div>
      </div>
    </template>
  </GridLayout>
  <button @click="getAndSetFromStorage">SET FROM STORAGE</button>
</template>

<script>
import GridLayout from "vue-mutable-grid-layout";
import { markRaw } from "vue";

export default {
  components: { GridLayout },
  data() {
    return {
      gridItems: this.getTestData(),
      currentTime: new Date(), 
    };
  },
  mounted() {
    setInterval(() => {
      this.currentTime = new Date(); 
    }, 1000);
  },
  computed: {
    getCurrent12hrTime() {
      const date = this.currentTime; 
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? "0" + minutes : minutes;
      const secondsStr = seconds < 10 ? "0" + seconds : seconds;

      return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
    },
  },
  methods: {
    handleUpdateItems(updatedItemList) {
      this.gridItems = updatedItemList;
      this.storeUpdatedItemsInLocalStorage();
    },
    getTestData(){
      return [
        { id: 1, active: true, color: "red",  customClass: 'my-custom-class', 
        customStyle: { color: 'yellow', fontSize: '20px' } },
        { id: 2, active: true, backgroundColor: "#0000FF80", color: "poop", component: markRaw(<YourComponent>), width: 2 },
        { id: 3, active: true, backgroundColor: "#00FF0070", color: "green", rawHTML: this.returnTest() },
        { id: 4, active: true, backgroundColor: "#800080", color: "purple", width: 1 },
        { id: 5, active: true, backgroundColor: "#888888", color: "grey"},
        { id: 6, active: true, backgroundColor: "#500080", color: "purple", width: 1 },
        { id: 7, active: false, backgroundColor: "#200080", color: "purple", width: 1 },
      ]
    },
        storeUpdatedItemsInLocalStorage() {
      localStorage.setItem('gridItems', JSON.stringify(this.gridItems));
    },
    getAndSetFromStorage() {
      const test = localStorage.getItem('gridItems')
      this.gridItems = JSON.parse(test);
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
      <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
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

