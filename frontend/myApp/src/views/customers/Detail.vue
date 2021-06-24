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

    <ion-content :fullscreen="true" v-if="customer">
      <div class="ion-padding">
        <h3>{{ customer.name }}</h3>
        <h4>Details</h4>
        <ul>
          <li>Address: {{ customer.address }}</li>
          <li>Zipcode: {{ customer.zipcode }}</li>
          <li>City: {{ customer.city }}</li>
          <li>Country: {{ customer.country }}</li>
          <li>Brithdate: {{ customer.date_of_birth }}</li>
          <li>ID card: {{ customer.has_id_card ? "Yes" : "No" }}</li>
          <li>Passport: {{ customer.has_passport ? "Yes" : "No" }}</li>
          <li>Created by: {{ customer.created_by.name }}</li>
        </ul>
      </div>

      <ion-button :disabled="showEdit" @click="showEdit = true"
        >Edit</ion-button
      >
      <ion-button color="danger" @click="handleDelete">Delete</ion-button>

      <div class="ion-padding" v-show="showEdit">
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
          <ion-label position="floating">Created By</ion-label>
          <ion-input
            type="text"
            class="form-control"
            :value="customer.created_by.id"
            readonly disabled
          />
        </ion-item>

        <ion-button color="light" @click="showEdit = false">
          Cancel
        </ion-button>
        <ion-button :disabled="disableEdit" @click="handleEdit">
          Save
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonDatetime,
  alertController,
} from "@ionic/vue";

import { useRoute, useRouter } from "vue-router";
import { defineComponent } from "vue";

import { CustomerService } from "@/services/customer.service";

export default defineComponent({
  name: "Detail",
  data() {
    return {
      getBackButtonText: () => {
        const mode = window && window.Ionic && window.Ionic.mode;
        return mode === "ios" ? "Back" : "";
      },
      loading: true,

      disableEdit: false,
      showEdit: false,

      customer: null,
    };
  },
  async mounted() {
    const route = useRoute();

    const response = await CustomerService.getCustomer(route.params.id);
    this.customer = response.data;

    this.loading = false;
  },
  methods: {
    handleEdit: async function () {
      if (this.disableEdit) return;

      try {
        this.disableEdit = true;

        const data = {
          address: this.customer.address,
          city: this.customer.city,
          country: this.customer.country,
          created_by: this.customer.created_by.id,
          date_of_birth: this.customer.date_of_birth,
          has_id_card: this.customer.has_id_card,
          has_passport: this.customer.has_passport,
          id: this.customer.id,
          name: this.customer.name,
          zipcode: this.customer.zipcode,
        };

        await CustomerService.editCustomer(this.customer.id, data);
        this.router.go();
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Updating failed",
          message: `Something went wrong trying to update this customer: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableEdit = false;
      }
    },
    handleDelete: async function () {
      const customer = this.customer;
      const router = this.router;

      const alert = await alertController.create({
        header: "Are you sure?",
        message: `Are you sure you want to delete ${customer.name}? This action cannot be undone.`,
        buttons: [
          {
            text: "No",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: async function () {
              await CustomerService.deleteCustomer(customer.id);
              router.push("/tabs/customers");
            },
          },
        ],
      });

      return alert.present();
    },
  },
  components: {
    IonBackButton,
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonCheckbox,
    IonDatetime,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
