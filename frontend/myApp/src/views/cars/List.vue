<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Cars</ion-title>
        <ion-buttons slot="primary">
          <ion-button button router-link="/facilities/create">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">cars</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="!loading">
        <ListItem
          v-for="car in searchedItems"
          :key="car.id"
          :car="car"
        />
      </ion-list>
      <ion-list v-else>
        <ListLoadingItems />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
} from "@ionic/vue";

import ListLoadingItems from "@/components/ListLoadingItems.vue";
import ListItem from "@/components/cars/ListItem.vue";
import { defineComponent } from "vue";
import { add } from "ionicons/icons";

import { CarService } from "@/services/car.service";

export default defineComponent({
  name: "cars",
  data() {
    return {
      loading: true,
      cars: null,
      search: null,
    };
  },
  computed: {
    searchedItems: function () {
      const cars = this.cars;
      const query = this.search;
      if (!query) return cars;
      return cars?.filter(
        (s) => s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    },
  },
  async mounted() {
    console.log("waiting for response..")
    const response = await CarService.getAll();
    this.cars = response.data;
    this.loading = false;
    console.log("got response:\n", response);
  },
  methods: {
    refresh: async function (ev) {
      try {
        this.loading = true;
        console.log("waiting for response..")
        const response = await CarService.getAll();
        this.cars = response.data;

        this.loading = false;
        ev.target.complete();
        console.log("got response:\n", response);
      } catch (error) {
        ev.target.cancel();
      }
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    ListLoadingItems,
    ListItem,
  },
  setup() {
    return {
      add,
    };
  },
});
</script>