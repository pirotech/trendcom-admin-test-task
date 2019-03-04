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

    <b-modal id="register" ref="registerModal" size="lg" title="Регистрация нового клиента">
      <b-container>
        <h5>Основная информация</h5>

        <b-row>
          <b-col>
            <b-input-group class="margin-top-10" prepend="Логин (email)" size="sm">
              <b-input
                placeholder="Введите email клиента"
                :state="registerModal.emailValid"
                v-model="registerModal.email"
              />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Пароль" size="sm">
              <b-input
                placeholder="Придумайте пароль"
                :type="'password'"
                :state="registerModal.passwordValid"
                v-model="registerModal.password"
              />
            </b-input-group>
          </b-col>
          <b-col>
            <b-input-group class="margin-top-10" prepend="Телефон" size="sm">
              <masked-input class="form-control"
                v-model="registerModal.phone"
                mask="\+7(111)-111-11-11"
                placeholder=""
              />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Тип заведения" size="sm">
              <b-form-select
                :options="allInstitutions"
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

    <b-modal id="editor" ref="editorModal" size="lg" title="Контактная информация">
      <b-container>
        <b-container>
          <h5>Основная информация</h5>

          <b-row>
            <b-col>
              <b-input-group class="margin-top-10" prepend="Логин (email)" size="sm">
                <b-input v-model="editorModal.email" disabled />
              </b-input-group>
              <b-input-group class="margin-top-10" prepend="Пароль" size="sm">
                <b-input
                  placeholder="Придумайте пароль"
                  :type="'password'"
                  :state="editorModal.passwordValid"
                  v-model="editorModal.password"
                />
              </b-input-group>
            </b-col>
            <b-col>
              <b-input-group class="margin-top-10" prepend="Телефон" size="sm">
                <masked-input class="form-control"
                  v-model="editorModal.phone"
                  mask="\+7(111)-111-11-11"
                />
              </b-input-group>
              <b-input-group class="margin-top-10" prepend="Статус" size="sm">
                <b-form-select
                  :options="allStatuses"
                  required
                  v-model="editorModal.status"
                />
              </b-input-group>
            </b-col>
          </b-row>
        </b-container>

        <b-container class="app-form-block">
          <h5>Контакты клиента</h5>

          <b-row>
            <b-col>
              <b-input-group class="margin-top-10" prepend="Название организации" size="sm">
                <b-input v-model="editorModal.institutionName" />
              </b-input-group>
              <b-input-group class="margin-top-10" prepend="ФИО руководителя" size="sm">
                <b-input v-model="editorModal.leader.fullName" />
              </b-input-group>
              <b-input-group class="margin-top-10" prepend="Телефон руководителя" size="sm">
                <masked-input class="form-control"
                  v-model="editorModal.leader.phone"
                  mask="\+7(111)-111-11-11"
                />
              </b-input-group>
              <b-input-group class="margin-top-10" prepend="Email руководителя" size="sm">
                <b-input v-model="editorModal.leader.email" />
              </b-input-group>
            </b-col>
            <b-col></b-col>
          </b-row>
        </b-container>
      </b-container>
      <div slot="modal-footer">
        <b-button
          class="float-right"
          size="sm"
          variant="warning"
          @click="cancelEditorModal"
        >Отмена</b-button>
        <b-button
          class="float-right margin-right-10"
          size="sm"
          variant="primary"
          @click="saveEditorModal"
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
      allInstitutions: [
        { value: 'coffee house', text: 'Кафе' },
        { value: 'library', text: 'Библиотека' },
        { value: 'gum', text: 'Спортзал' }
      ],
      allStatuses: [
        { value: 'active', text: 'Активен' },
        { value: 'blocked', text: 'Заблокирован' }
      ],
      registerModal: {
        email: '',
        password: '',
        phone: '',
        institution: 'coffee house',
        emailValid: true,
        passwordValid: true
      },
      editorModal: {
        email: '',
        password: '',
        phone: '',
        status: 'active',
        institutionName: '',
        leader: {
          fullName: '',
          phone: '',
          email: ''
        },
        passwordValid: true
      }
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
      const { email, password, phone, institution } = this.registerModal;
      // validation
      const emailValid = (email !== '');
      const passwordValid = (password !== '');
      this.registerModal.emailValid = emailValid;
      this.registerModal.passwordValid = passwordValid;
      if (emailValid && passwordValid) {
        // collect and save user
        this.users = [...this.users, new User({
          email,
          password,
          phone,
          institution,
          status: 'active',
          type: 'Клиент'
        })];
        localStorage.setItem('users', JSON.stringify(this.users));
        // cancel modal
        setTimeout(() => {
          this.cancelRegisterModal();
        }, 400);
      }
    },
    openEditor(entity) {
      // init form
      this.editorModal = {
        ...this.editorModal,
        ...entity
      };
      // show modal
      this.$refs.editorModal.show();
    },
    cancelEditorModal() {
      // clear form
      this.editorModal.email = '';
      this.editorModal.password = '';
      this.editorModal.phone = '';
      this.editorModal.status = 'active';
      this.editorModal.institutionName = '';
      this.editorModal.leader.fullName = '';
      this.editorModal.leader.phone = '';
      this.editorModal.leader.email = '';
      // close modal
      this.$refs.editorModal.hide();
    },
    saveEditorModal() {
      const { id, password } = this.editorModal;
      // validation
      const passwordValid = (password !== '');
      this.editorModal.passwordValid = passwordValid;
      if (passwordValid) {
        // collect and save user
        const withoutOld = this.users.filter(item => item.id !== id);
        this.users = [ ...withoutOld, new User({ ...this.editorModal }) ];
        localStorage.setItem('users', JSON.stringify(this.users));
        // cancel modal
        setTimeout(() => {
          this.cancelEditorModal();
        }, 400);
      }
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
