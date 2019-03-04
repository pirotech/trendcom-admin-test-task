class User {

  constructor(entity) {
    this.id = entity.id === undefined ? Math.round(Math.random() * 100) : entity.id;
    this.email = entity.email === undefined ? '' : entity.email;
    this.status = entity.status === undefined ? '' : entity.status;
    this.type = entity.type === undefined ? '' : entity.type;
    this.lastVisit = entity.lastVisit === undefined ? '' : new Date(entity.lastVisit);
    this.payment = entity.payment === undefined ? 0 : entity.payment;
    this.balance = entity.balance === undefined ? 0 : entity.balance;
    this.password = entity.password === undefined ? '' : entity.password;
    this.phone = entity.phone === undefined ? '' : entity.phone;
    this.institution = entity.institution === undefined ? '' : entity.institution
  }

}

export default User;
