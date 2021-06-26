<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Register</ion-title>
        </ion-toolbar>
      </ion-header>

      <form @submit.prevent="handleRegister">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Register</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            Welcome to the Call a Car app! If you don't have an account yet,
            you can sign up here to get access to the Call a Car app.
          </ion-card-content>

          <ion-card-content>
            <ion-item>
              <ion-label position="floating">First name</ion-label>
              <ion-input v-model="form.firstName" id="firstName" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Last name</ion-label>
              <ion-input v-model="form.lastName" id="lastName" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Email</ion-label>
              <ion-input
                type="email"
                v-model="form.email"
                id="email"
                required
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Phone number</ion-label>
              <ion-input v-model="form.phoneNr" id="phoneNr" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">License</ion-label>
              <ion-checkbox v-model="form.license" id= "license" required></ion-checkbox>
            </ion-item>
            <!-- <ion-item>
              <ion-label position="floating">Password</ion-label>
              <ion-input
                type="password"
                v-model="form.password"
                id="email"
                required
              ></ion-input>
            </ion-item> -->
          </ion-card-content>


          <ion-card-content>
            <ion-button type="submit">
              <ion-icon slot="start" :icon="personAdd"></ion-icon>
              Register
            </ion-button>
            <ion-button type="button" router-link="/login">
              <ion-icon slot="start" :icon="logIn"></ion-icon>
              Login
            </ion-button>
          </ion-card-content>
        </ion-card>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonPage,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";

import { logIn, personAdd } from "ionicons/icons";
import { useRouter } from "vue-router";
import { AuthenticationError, AuthService } from "@/services/auth.service";

export default {
  name: "Register",
  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const router = useRouter();
    return {
      router,
      logIn,
      personAdd,
    };
  },
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNr: "",
        license: false
        // password: "",
      },
    };
  },
  computed: {},
  methods: {
    async handleRegister() {
      if (this.form.firstName && this.form.lastName && this.form.email && this.form.phoneNr && this.form.license) {
        const registerUser = {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          phoneNr: this.form.phoneNr,
          license: this.form.license
          // password: this.form.password,
        };

        // Register.
        try {
          await AuthService.register(
            registerUser.firstName,
            registerUser.lastName,
            registerUser.email,
            registerUser.phoneNr,
            registerUser.license
          );
          this.router.push("/");
        } catch (error) {
          if (error instanceof AuthenticationError) {
            const errorAlert = await alertController.create({
              header: `Register failed (#${error.errorCode})`,
              message: `Something went wrong trying to register: ${
                error.message || "Unknown Error"
              }`,
              buttons: ["OK"],
            });
            await errorAlert.present();
          } else {
            const errorAlert = await alertController.create({
              header: "Register failed",
              message:
                "Something went wrong trying to register, please try again.",
              buttons: ["OK"],
            });
            await errorAlert.present();
          }
        }
      } else {
        const errorAlert = await alertController.create({
          header: "Register failed",
          message:
            "Please make sure you properly filled in all required information.",
          buttons: ["OK"],
        });
        await errorAlert.present();
      }
    },
  },
};
</script>