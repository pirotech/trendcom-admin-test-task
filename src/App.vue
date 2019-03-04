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

    <b-table class="app-users" striped hover :items="tabledUsers" :fields="fields" />
    <div class="app-statistics">
      <p>Всего клиентов: {{ users ? users.length : '-' }}</p>
      <p>Заблокированных пользователей: {{ users ? filterUsers('blocked').length : '-' }}</p>
    </div>

    <b-modal id="register" ref="registerModal" size="lg" title="Регистрация нового клиента">
      <b-container>
        <h5>Основная информация</h5>

        <b-row>
          <b-col>
            <b-input-group class="margin-top-10" prepend="Логин (email)">
              <b-input
                placeholder="Введите email клиента"
                :type="'email'"
                v-model="registerModal.email"
              />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Пароль">
              <b-input
                placeholder="Придумайте пароль"
                :type="'password'"
                v-model="registerModal.password"
              />
            </b-input-group>
          </b-col>
          <b-col>
            <b-input-group class="margin-top-10" prepend="Телефон">
              <masked-input class="form-control"
                v-model="registerModal.phone"
                mask="\+7(111)-111-11-11"
                placeholder=""
              />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Тип заведения">
              <b-form-select
                :options="registerModal.allInstitutions"
                required
                v-model="registerModal.institution"
              />
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
      <div slot="modal-footer">
        <b-button
          class="float-right"
          size="sm"
          variant="warning"
          @click="cancelRegisterModal"
        >Отмена</b-button>
        <b-button
          class="float-right margin-right-10"
          size="sm"
          variant="primary"
          @click="saveRegisterModal"
        >Сохранить</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import MaskedInput from 'vue-masked-input';
import moment from 'moment';
import loadedUsers from './users.json';
import User from './User';

export default {
  name: 'App',
  components: {
    'masked-input': MaskedInput
  },
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
      },
      fields: [
        { key: 'id', label: 'ID', sortable: false },
        { key: 'email', label: 'Клиент', sortable: false },
        { key: 'status', label: 'Статус', sortable: false },
        { key: 'type', label: 'Тип', sortable: false },
        { key: 'lastVisit', label: 'Последнее посещение', sortable: true },
        { key: 'payment', label: 'Абонентская плата', sortable: false },
        { key: 'balance', label: 'Баланс', sortable: false }
      ],
      registerModal: {
        allInstitutions: [
          { value: 'coffee house', text: 'Кафе' },
          { value: 'library', text: 'Библиотека' },
          { value: 'gum', text: 'Спортзал' }
        ],
        email: '',
        password: '',
        phone: '',
        institution: 'coffee house'
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
            return item.status === 'blocked';
          case 'active':
            return item.status === 'active';
          default:
            return true;
        }
      });
    },
    cancelRegisterModal() {
      // clear form
      this.registerModal.email = '';
      this.registerModal.password = '';
      this.registerModal.phone = '';
      this.registerModal.institution = 'caffee house';
      // close modal
      this.$refs.registerModal.hide();
    },
    saveRegisterModal() {
      // collect and save user
      const { email, password, phone, institution } = this.registerModal;
      const isValid = email !== '' && password !== '';
      if (isValid) {
        this.users = [ ...this.users, new User({
          email,
          password,
          phone,
          institution
        })];
        this.filteredUsers = this.filterUsers();
        localStorage.setItem('users', JSON.stringify(this.users));
        // cancel modal
        this.cancelRegisterModal();
      }
    },
  },
  computed: {
    tabledUsers() {
      return this.filteredUsers.map(item => ({
        ...item,
        lastVisit: item.lastVisit !== ''
          ? moment(new Date(item.lastVisit)).format('DD.MM.YYYY') : '-',
        status: item.status === 'active'
          ? 'Активен' : item.status === 'blocked'
            ? 'Заблокирован' : '-',
        type: item.type || '-'
      }));
    }
  },
  mounted () {
    // check for empty storage
    let storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(loadedUsers));
    }
    // set up from storage
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
.margin-right-10 {
  margin-right: 10px;
}
.margin-top-10 {
  margin-top: 10px;
}
</style>
