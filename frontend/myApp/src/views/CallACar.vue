<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>CALL A CAR</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">CALL A CAR</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <order-ride name="CALL A CAR" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import OrderRide from '../components/OrderRide.vue';

export default  {
  name: 'CallACar',
  components: { OrderRide, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>