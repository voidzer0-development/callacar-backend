<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Facilities</ion-title>
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
          <ion-title size="large">facilities</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="!loading">
        <ListItem
          v-for="facility in searchedItems"
          :key="facility.id"
          :facility="facility"
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
import ListItem from "@/components/facilities/ListItem.vue";
import { defineComponent } from "vue";
import { add } from "ionicons/icons";

import { FacilityService } from "@/services/facility.service";

export default defineComponent({
  name: "facilities",
  data() {
    return {
      loading: true,
      facilities: null,
      search: null,
    };
  },
  computed: {
    searchedItems: function () {
      const facilities = this.facilities;
      const query = this.search;
      if (!query) return facilities;
      return facilities?.filter(
        (s) => s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    },
  },
  async mounted() {
    const response = await FacilityService.getFacilities();
    this.facilities = response.data;
    this.loading = false;
  },
  methods: {
    refresh: async function (ev) {
      try {
        this.loading = true;

        const response = await FacilityService.getFacilities();
        this.facilities = response.data;

        this.loading = false;
        ev.target.complete();
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