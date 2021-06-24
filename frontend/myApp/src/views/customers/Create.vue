<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            :text="getBackButtonText()"
            default-href="/"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Customer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.prevent="handleCreate">
        <div class="ion-padding">
          <ion-item>
            <ion-label position="floating">Name</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="customer.name"
              id="customer_name"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Address</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="customer.address"
              id="customer_adress"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Zipcode</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="customer.zipcode"
              id="customer_zipcode"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">City</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="customer.city"
              id="customer_city"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Country</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="customer.country"
              id="customer_country"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Date of Birth</ion-label>
            <ion-datetime
              display-format="MMMM DD, YYYY"
              :max="new Date().toISOString()"
              v-model="customer.date_of_birth"
              required
            ></ion-datetime>
          </ion-item>

          <ion-item lines="full">
            <ion-label>ID card</ion-label>
            <ion-checkbox
              slot="end"
              @update:modelValue="customer.has_id_card = $event"
              :modelValue="customer.has_id_card"
            >
            </ion-checkbox>
          </ion-item>

          <ion-item lines="full">
            <ion-label>Passport</ion-label>
            <ion-checkbox
              slot="end"
              @update:modelValue="customer.has_passport = $event"
              :modelValue="customer.has_passport"
            >
            </ion-checkbox>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Created by User ID</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="customer.created_by"
              id="customer_created_by"
              required
            />
          </ion-item>

          <ion-button type="submit" :disabled="disableSubmit">
            Create
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonCheckbox,
  IonDatetime,
  alertController,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import { CustomerService } from "@/services/customer.service";

export default defineComponent({
  name: "Detail",
  data() {
    return {
      getBackButtonText: () => {
        const mode = window && window.Ionic && window.Ionic.mode;
        return mode === "ios" ? "Back" : "";
      },
      disableSubmit: false,
      loading: true,
      customer: {
        name: null,
        address: null,
        zipcode: null,
        city: null,
        country: null,
        date_of_birth: null,
        created_by: null,
      },
    };
  },
  methods: {
    async handleCreate() {
      if (this.disableSubmit) return;

      try {
        this.disableSubmit = true;
        await CustomerService.createCustomer(this.customer);
        this.router.push("/tabs/customers");
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this customer: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableSubmit = false;
      }
    },
  },
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonCheckbox,
    IonDatetime,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
