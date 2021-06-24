<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Customers</ion-title>
        <ion-buttons slot="primary">
          <ion-button button router-link="/customers/create">
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
          <ion-title size="large">Customers</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="!loading">
        <ListItem
          v-for="customer in searchedItems"
          :key="customer.id"
          :customer="customer"
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
import ListItem from "@/components/customers/ListItem.vue";
import { defineComponent } from "vue";
import { add } from "ionicons/icons";

import { CustomerService } from "@/services/customer.service";

export default defineComponent({
  name: "Customers",
  data() {
    return {
      loading: true,
      customers: null,
      search: null,
    };
  },
  computed: {
    searchedItems: function () {
      const customers = this.customers;
      const query = this.search;
      if (!query) return customers;
      return customers?.filter(
        (s) => s.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    },
  },
  async mounted() {
    const response = await CustomerService.getCustomers();
    this.customers = response.data;
    this.loading = false;
  },
  methods: {
    refresh: async function (ev) {
      try {
        this.loading = true;

        const response = await CustomerService.getCustomers();
        this.customers = response.data;

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