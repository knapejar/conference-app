<template>
  <ion-content>
    <ion-list>
      <PeopleListItem 
        v-for="person in people" 
        :key="person.name" 
        :person="person" 
        @openModal="openModal(person)" />
    </ion-list>

    <ion-modal 
      :is-open="isModalVisible" 
      @didDismiss="closeModal" 
      :swipeToClose="true" 
      :presenting-element="presentingElement"
    >
      <PersonModal 
        :person="selectedPerson" 
        @close="closeModal" 
      />
    </ion-modal>
  </ion-content>
</template>

<script>
import { ref, onMounted } from 'vue';
export default {
  name: 'PeopleList',
  props: {
    people: {
      type: Array,
      required: true
    }
  },
  setup() {
    const selectedPerson = ref(null);
    const isModalVisible = ref(false);
    const presentingElement = ref(null);

    const openModal = (person) => {
      selectedPerson.value = person;
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    onMounted(() => {
      presentingElement.value = document.querySelector('ion-content');
    });

    return {
      selectedPerson,
      isModalVisible,
      openModal,
      closeModal,
      presentingElement
    };
  }
};
</script>