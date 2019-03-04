<template lang="html">
  <b-modal id="register" ref="modal" size="lg" title="Регистрация нового клиента">
    <b-container>
      <h5>Основная информация</h5>

      <b-row>
        <b-col>
          <b-input-group class="margin-top-10" prepend="Логин (email)" size="sm">
            <b-input
              placeholder="Введите email клиента"
              :state="emailValid"
              v-model="email"
            />
          </b-input-group>
          <b-input-group class="margin-top-10" prepend="Пароль" size="sm">
            <b-input
              placeholder="Придумайте пароль"
              :type="'password'"
              :state="passwordValid"
              v-model="password"
            />
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group class="margin-top-10" prepend="Телефон" size="sm">
            <masked-input class="form-control"
              v-model="phone"
              mask="\+7(111)-111-11-11"
              placeholder=""
            />
          </b-input-group>
          <b-input-group class="margin-top-10" prepend="Тип заведения" size="sm">
            <b-form-select
              :options="allInstitutions"
              required
              v-model="institution"
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
import User from '../User';

export default {
  name: 'RegisterModal',
  components: {
    'masked-input': MaskedInput
  },
  props: [ 'onRegister' ],
  data() {
    return {
      allInstitutions: [
        { value: 'coffee house', text: 'Кафе' },
        { value: 'library', text: 'Библиотека' },
        { value: 'gum', text: 'Спортзал' }
      ],
      email: '',
      password: '',
      phone: '',
      institution: 'coffee house',
      emailValid: true,
      passwordValid: true
    };
  },
  methods: {
    cancel() {
      // clear form
      this.email = '';
      this.password = '';
      this.phone = '';
      this.institution = 'caffee house';
      // close modal
      this.$refs.modal.hide();
    },
    save() {
      // validation
      const emailValid = (this.email !== '');
      const passwordValid = (this.password !== '');
      this.emailValid = emailValid;
      this.passwordValid = passwordValid;
      if (emailValid && passwordValid) {
        // collect and pass user
        const user = new User({
          ...this,
          status: 'active',
          type: 'Клиент'
        });
        this.onRegister(user);
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
