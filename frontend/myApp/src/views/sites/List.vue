<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sites</ion-title>
        <ion-buttons slot="primary">
          <ion-button button router-link="/sites/create">
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
          <ion-title size="large">Sites</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="!loading">
        <ListItem v-for="site in searchedItems" :key="site.id" :site="site" />
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
import ListItem from "@/components/sites/ListItem.vue";
import { defineComponent } from "vue";
import { add } from "ionicons/icons";

import { SiteService } from "@/services/site.service";

export default defineComponent({
  name: "Sites",
  data() {
    return {
      loading: true,
      sites: null,
      search: null,
    };
  },
  computed: {
    searchedItems: function () {
      const sites = this.sites;
      const query = this.search;
      if (!query) return sites;
      return sites?.filter(
        (s) => s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    },
  },
  async mounted() {
    const response = await SiteService.getSites();
    this.sites = response.data;
    this.loading = false;
  },
  methods: {
    refresh: async function (ev) {
      try {
        this.loading = true;

        const response = await SiteService.getSites();
        this.sites = response.data;

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