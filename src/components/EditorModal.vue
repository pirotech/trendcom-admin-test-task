<template lang="html">
  <b-modal id="editor" ref="editorModal" size="lg" title="Контактная информация">
    <b-container>
      <b-container>
        <h5>Основная информация</h5>

        <b-row>
          <b-col>
            <b-input-group class="margin-top-10" prepend="Логин (email)" size="sm">
              <b-input v-model="user.email" disabled />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Пароль" size="sm">
              <b-input
                placeholder="Придумайте пароль"
                :type="'password'"
                :state="passwordValid"
                v-model="user.password"
              />
            </b-input-group>
          </b-col>
          <b-col>
            <b-input-group class="margin-top-10" prepend="Телефон" size="sm">
              <masked-input class="form-control"
                v-model="user.phone"
                mask="\+7(111)-111-11-11"
              />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Статус" size="sm">
              <b-form-select
                :options="allStatuses"
                required
                v-model="user.status"
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
              <b-input v-model="user.institutionName" />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="ФИО руководителя" size="sm">
              <b-input v-model="user.leader.fullName" />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Телефон руководителя" size="sm">
              <masked-input class="form-control"
                v-model="user.leader.phone"
                mask="\+7(111)-111-11-11"
              />
            </b-input-group>
            <b-input-group class="margin-top-10" prepend="Email руководителя" size="sm">
              <b-input v-model="user.leader.email" />
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
        @click="cancel"
      >Отмена</b-button>
      <b-button
        class="float-right margin-right-10"
        size="sm"
        variant="primary"
        @click="save"
      >Сохранить</b-button>
    </div>
  </b-modal>
</template>

<script>
import MaskedInput from 'vue-masked-input';

export default {
  name: 'EditorModal',
  props: [ 'user', 'onEdit' ],
  components: {
    'masked-input': MaskedInput
  },
  data() {
    return {
      allStatuses: [
        { value: 'active', text: 'Активен' },
        { value: 'blocked', text: 'Заблокирован' }
      ],
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
    };
  },
  methods: {
    cancel() {
      this.edited = { leader: {} };
      this.$root.$emit('bv::hide::modal', 'editor');
    },
    save() {
      // validation
      const passwordValid = (this.user.password !== '');
      this.passwordValid = passwordValid;
      if (passwordValid) {
        // collect and pass user
        this.onEdit();
        // cancel modal
        setTimeout(() => {
          this.cancel();
        }, 400);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
