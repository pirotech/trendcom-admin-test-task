<template>
  <div id="app" class="app">
    <b-navbar class="app-header" toggleable="lg" type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-text>admin@yandex.ru</b-nav-text>
        <b-nav-item v-b-modal.add>Добавить клиента</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#">Выйти</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <div class="app-filters">
      <b-button
        v-for="(item, index) in filters.modes"
        :key="index"
        variant="primary"
        :pressed="item.value === filters.mode"
        @click="() => filterChanged(item.value)"
      >{{ item.label }}</b-button>
    </div>

    <b-table class="app-users" striped hover :items="filteredUsers" />
    <div class="app-statistics">
      <p>Всего клиентов: {{ users ? users.length : '-' }}</p>
      <p>Заблокированных пользователей: {{ users ? filterUsers('blocked').length : '-' }}</p>
    </div>

    <b-modal id="add" title="Регистрация нового клиента">
      <p class="my-4">Основная информация</p>
    </b-modal>
  </div>
</template>

<script>
import loadedUsers from './users.json'

export default {
  name: 'App',
  components: {},
  data () {
    return {
      users: [],
      filteredUsers: [],
      filters: {
        modes: [
          { label: 'Показать всех', value: 'all' },
          { label: 'Показать только заблокированных', value: 'blocked' },
          { label: 'Показать только активных', value: 'active' }
        ],
        mode: 'all'
      }
    }
  },
  methods: {
    filterChanged(value) {
      this.filters.mode = value;
      this.filteredUsers = this.filterUsers(value);
    },
    filterUsers(value) {
      return this.users.filter(item => {
        switch (value) {
          case 'all':
            return true;
          case 'blocked':
            return item['Статус'] === 'Заблокирован';
          case 'active':
            return item['Статус'] === 'Активен';
          default:
            return true;
        }
      });
    }
  },
  mounted () {
    let storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(loadedUsers));
    }

    storedUsers = localStorage.getItem('users');
    this.users = JSON.parse(storedUsers);
    this.filteredUsers = this.users;
  }
}
</script>

<style lang="scss">
.app {
  &-filters {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
  }
  &-statistics {
    padding: 20px;
  }
}
</style>
