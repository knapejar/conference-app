<template>
  <div>
    <ion-list>
      <PeopleListItem 
        v-for="person in people" 
        :key="person.id" 
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
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
export default {
  name: 'PeopleList',
  props: {
    people: {
      type: Array,
      required: true
    }
  },
  setup(props) {
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
      console.log('PeopleList mounted with people:', props.people);
    });

    watch(() => props.people, (newPeople) => {
      console.log('People prop changed:', newPeople);
    }, { immediate: true });

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