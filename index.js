let store = {customers: [], meals: [], deliveries: [], employers: []}

let customerId = 0

class Customer {
  constructor(name, employer) {
    this.id = ++customerId
    this.name = name
    if (employer) {this.employerId = employer.id}
    store.customers.push(this)
  }

  deliveries() {
    return store.deliveries.filter(delivery => this.id === delivery.customerId)
  }

  meals() {
    return this.deliveries().map(function(delivery) {
      return delivery.meal()
    })
  }

  totalSpent() {
    return this.meals().reduce(function(total, meal) {
      return meal.price + total
    }, 0)
  }
}



let mealId = 0

class Meal {
  constructor(title, price) {
    this.title = title
    this.price = price
    this.id = ++mealId
    store.meals.push(this)
  }

  deliveries() {
    return store.deliveries.filter(delivery => delivery.mealId === this.id)
  }


  customers() {
    return this.deliveries().map(delivery => delivery.customer());
  }

  static byPrice() {
    return store.meals.sort(function(a,b) {
      return b.price - a.price
    })
  }
}




let deliveryId = 0

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId
    if(meal) {this.mealId = meal.id}
    if (customer) {this.customerId = customer.id}
    store.deliveries.push(this)
  }

  meal() {
  return store.meals.find(meal => this.mealId === meal.id)
  }

  customer() {
    return store.customers.find(customer =>
      this.customerId === customer.id
    )
  }
}

let employerId = 0

class Employer {
  constructor(name) {
    this.name = name
    this.id = ++employerId
    store.employers.push(this)
  }

  employees() {
    return store.customers.filter(customer => this.id === customer.employerId)
  }

  deliveries() {
    const d = this.employees().map(customer => customer.deliveries())
    return d.reduce(function(array, delivery) {
      return array.concat(delivery)
    }, [])
  }

  meals() {
    let mealsList = []
    this.deliveries().forEach(function(delivery) {
      if(!mealsList.includes(delivery.meal())) {
        mealsList.push(delivery.meal())
      }
    })
    return mealsList
  }

  mealTotals() {
    return this.deliveries().reduce(function(object, delivery) {
      let mId = delivery.mealId
      if (object[mId]) {
        object[mId] += 1
      } else {
        object[mId] = 1
      }
      return object

    }, {})
  }
}
