import { test, expect } from '@playwright/test';
import assert from 'assert';
import axios, { AxiosResponse } from 'axios';


const apiBaseUrl = `http://localhost:3000`

test('get all users response == 200', async () => {
  let endpointUrl = `/users`
  let allUsers = (await axios.get(apiBaseUrl + endpointUrl))
  let usersJSON = JSON.parse(JSON.stringify(allUsers.data))

  assert(allUsers.status === 200 && usersJSON.length > 0)
});

test('post user response == 201', async () => {
  let endpointUrl = `/users`
  let requestBody = `{
    "id": "500",
    "name": "Frodo Baggins2",
    "email": "frodo.baggins2@dev.dietly.pl"
}`
  let response = (await axios.post(apiBaseUrl + endpointUrl, requestBody))
  let usersJSON = JSON.parse(JSON.stringify(response.data))

  assert(response.status === 201) //expected 201, because no validation in requirements, but in real life this should be blocked as duplicate
});
test('no users have _debug value', async () => {
  let endpointUrl = `/users`
  let allUsers = (await axios.get(apiBaseUrl + endpointUrl))
  let usersJSON = JSON.parse(JSON.stringify(allUsers.data))
  let usersWithDebug = allUsers.data.filter(element => element._debug)

  console.log(usersWithDebug)
  console.log(usersWithDebug.length);
  assert(usersWithDebug.length === 0)
});


test('get caterings response is 200', async () => {
  let endpointUrl = `/caterings`
  let allCaterings = (await axios.get(apiBaseUrl + endpointUrl))
  let cateringsJSON = JSON.parse(JSON.stringify(allCaterings.data))

  assert(allCaterings.status === 200 && cateringsJSON.length > 0)
});

test('no caterings have _debug value', async () => {
  let endpointUrl = `/caterings`
  let allCaterings = (await axios.get(apiBaseUrl + endpointUrl))
  let cateringsJSON = JSON.parse(JSON.stringify(allCaterings.data))
  let cateringsWithDebug = allCaterings.data.filter(element => element._debug)

  console.log(cateringsWithDebug)
  console.log(cateringsWithDebug.length);

  assert(cateringsWithDebug.length === 0)
});

test('get diets response is 200', async () => {
  let endpointUrl = `/diets`
  let allDiets = (await axios.get(apiBaseUrl + endpointUrl))
  let dietsJSON = JSON.parse(JSON.stringify(allDiets.data))

  assert(allDiets.status === 200 && dietsJSON.length > 0)
});

test('no diets have _debug value', async () => {
  let endpointUrl = `/diets`
  let allDiets = (await axios.get(apiBaseUrl + endpointUrl))
  let dietsJSON = JSON.parse(JSON.stringify(allDiets.data))
  let dietsWithDebug = allDiets.data.filter(element => element._debug)

  console.log(dietsWithDebug)
  console.log(dietsWithDebug.length);

  assert(dietsWithDebug.length === 0)
});

test('get offers response is 200', async () => {
  let endpointUrl = `/offers`
  let allOffers = (await axios.get(apiBaseUrl + endpointUrl))
  let offersJSON = JSON.parse(JSON.stringify(allOffers.data))

  assert(allOffers.status === 200 && offersJSON.length > 0)

});

test('no offers have _debug value', async () => {
  let endpointUrl = `/offers`
  let allOffers = (await axios.get(apiBaseUrl + endpointUrl))
  let offeresJSON = JSON.parse(JSON.stringify(allOffers.data))
  let offersWithDebug = allOffers.data.filter(element => element._debug)

  console.log(offersWithDebug)
  console.log(offersWithDebug.length);

  assert(offersWithDebug.length === 0)
});

test('get orders response is 200', async () => {
  let endpointUrl = `/orders`
  let allOrders = (await axios.get(apiBaseUrl + endpointUrl))
  let ordersJSON = JSON.parse(JSON.stringify(allOrders.data))

  assert(allOrders.status === 200 && ordersJSON.length > 0)

});

test('no orders have _debug value', async () => {
  let endpointUrl = `/orders`
  let allOrders = (await axios.get(apiBaseUrl + endpointUrl))
  let ordersJSON = JSON.parse(JSON.stringify(allOrders.data))
  let ordersWithDebug = allOrders.data.filter(element => element._debug)

  console.log(ordersWithDebug)
  console.log(ordersWithDebug.length);

  assert(ordersWithDebug.length === 0)
});

test('check if diet is ordered for 1-30 days', async () => {
  let endpointUrl = `/orders`
  type Order = {
    id: number;
    datetime: any;
    from_date: any;
    to_date: any;
    dietId: number;
    userId: number;
    _debug: string | undefined;
  }
  let orders = (await axios.get(apiBaseUrl + endpointUrl))
  let ordersJSON = JSON.parse(JSON.stringify(orders.data))

  const ordersObj = ordersJSON as Order[];

  console.log(ordersObj);

  let invalidOrders: number[] = []
  for (let index = 0; index < ordersJSON.length; index++) {
    const element = ordersObj[index];
    let toDate = new Date(element.to_date)
    let fromDate = new Date(element.from_date)
    let diff = toDate.valueOf() - fromDate.valueOf();
    let diffInDays = Math.ceil(diff / (1000 * 3600 * 24))
    try {
      expect(diffInDays).toBeLessThanOrEqual(30);
      expect(diffInDays).toBeGreaterThanOrEqual(1);
    } catch (error) {
      invalidOrders.push(element.id)
    }
  }
  console.log(invalidOrders)
});

test('check if diet is ordered from 1 to 30 days from days of order to start date', async () => {
  let endpointUrl = `/orders`
  type Order = {
    id: number;
    datetime: any;
    from_date: any;
    to_date: any;
    dietId: number;
    userId: number;
    _debug: string | undefined;
  }
  let orders = (await axios.get(apiBaseUrl + endpointUrl))
  let ordersJSON = JSON.parse(JSON.stringify(orders.data))

  const ordersObj = ordersJSON as Order[];

  let invalidOrders: number[] = []
  for (let index = 0; index < ordersJSON.length; index++) {
    const element = ordersObj[index];
    let orderDate = new Date(element.datetime)
    let fromDate = new Date(element.from_date)
    let diff = fromDate.valueOf() - orderDate.valueOf();
    let diffInDays = Math.ceil(diff / (1000 * 3600 * 24))
    try {
      expect(diffInDays).toBeLessThanOrEqual(30);
      expect(diffInDays).toBeGreaterThanOrEqual(1);
    } catch (error) {
      invalidOrders.push(element.id)
    }
  }
  console.log(invalidOrders)
});
