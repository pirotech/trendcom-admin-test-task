<template>
  <div id="app" class="app">
    <b-navbar class="app-header" toggleable="lg" type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-text>admin@yandex.ru</b-nav-text>
        <b-nav-item v-b-modal.register>Добавить клиента</b-nav-item>
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

    <b-table class="app-users"
      hover
      :items="filteredUsers"
      :fields="fields"
      :tbody-tr-class="rowClass"
      @row-clicked="openEditor"
    />
    <div class="app-statistics">
      <p>Всего клиентов: {{ users ? users.length : '-' }}</p>
      <p>Заблокированных пользователей: {{ users ? blockedUsers.length : '-' }}</p>
    </div>

    <RegisterModal :onRegister="onRegister" />
    <EditorModal :user="edited" :onEdit="onEdit" />
  </div>
</template>

<script>
import moment from 'moment';
import RegisterModal from './components/RegisterModal';
import EditorModal from './components/EditorModal';
import loadedUsers from './users.json';
import User from './User';

export default {
  name: 'App',
  components: {
    'RegisterModal': RegisterModal,
    'EditorModal': EditorModal
  },
  data() {
    return {
      users: [],
      filters: {
        modes: [
          { label: 'Показать всех', value: 'all' },
          { label: 'Показать только заблокированных', value: 'blocked' },
          { label: 'Показать только активных', value: 'active' }
        ],
        mode: 'all'
      },
      fields: [
        {
          key: 'id',
          label: 'ID',
          sortable: false
        },
        {
          key: 'email',
          label: 'Клиент',
          sortable: false
        },
        {
          key: 'status',
          label: 'Статус',
          sortable: false,
          formatter: value => {
            return value === 'active'
              ? 'Активен' : value === 'blocked'
                ? 'Заблокирован' : '-';
          }
        },
        {
          key: 'type',
          label: 'Тип',
          sortable: false,
          formatter: value => value || '-'
        },
        {
          key: 'lastVisit',
          label: 'Последнее посещение',
          sortable: true,
          formatter: value => {
            return value !== ''
              ? moment(new Date(value)).format('DD.MM.YYYY') : '-';
          }
        },
        {
          key: 'payment',
          label: 'Абонентская плата',
          sortable: false
        },
        {
          key: 'balance',
          label: 'Баланс',
          sortable: false
        }
      ],
      edited: { leader: {} }
    };
  },
  methods: {
    filterChanged(value) {
      this.filters.mode = value;
    },
    rowClass(item) {
      if (item.status === 'blocked') {
        return 'table-danger';
      }
      return '';
    },
    onRegister(user) {
      this.users = [ ...this.users, user ];
      localStorage.setItem('users', JSON.stringify(this.users));
    },
    openEditor(user) {
      this.edited = new User(user);
      this.$root.$emit('bv::show::modal', 'editor');
    },
    onEdit() {
      // save user
      const withoutOld = this.users.filter(item => item.id !== this.edited.id);
      this.users = [ ...withoutOld, this.edited ];
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(item => {
        switch (this.filters.mode) {
          case 'all':
            return true;
          case 'blocked':
            return item.status === 'blocked';
          case 'active':
            return item.status === 'active';
          default:
            return true;
        }
      });
    },
    blockedUsers() {
      return this.users.filter(item => item.status === 'blocked');
    }
  },
  mounted() {
    // check for empty storage
    let storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(loadedUsers));
    }
    // set up from storage
    storedUsers = localStorage.getItem('users');
    this.users = JSON.parse(storedUsers);
  }
};
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
  &-form-block {
    margin-top: 20px;
  }
}
.margin-right-10 {
  margin-right: 10px;
}
.margin-top-10 {
  margin-top: 10px;
}
</style>
