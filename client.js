/*
Prime Group jQuery Challenge
jQuery is great! It allows us to do so many things! You and your group will
need to flex everything you know about Javascript, jQuery, and Bootstrap
to tackle this challenge.

The Fruit Market
For this challenge, you will be working with 4 commodities; Apples, Oranges,
Bananas, and Grapes. Delicious, right?

When the application loads, you will need to have information for each of the
commodities, specifically the name and the market price of each. This information
will need to be displayed in a meaningful way on the DOM.

Every 15 seconds, the prices should change however, and with it, the listed
price on the DOM. Specifically, the market price of each of the items should
fluctuate up or down 50 cents (between 1 cent and 50 cents) with each 15 second
interval. Any given fruit is not allowed to go below a cost of 50 cents, or above
the cost of 9 dollars and 99 cents.

The information displayed for each of the fruit should have a button-like
functionality where the user can interact with each of the fruit displays.

Available to the user is a total cash and an inventory display that shows
how much of each of the fruits they have purchased. Also in the user display,
should be an average purchased price, which shows, on average, how much money
they have spent on a given fruit in their inventory.

Meaning that by clicking on the display for each of the fruits, allows the
user to buy one of the fruits, at market price, which will be deducted from
the total cash. The user is not allowed to spend more than they have.

The user will start with $100.

Application Mockup
Use this image as a guide for what the application should look like.

Hard Mode
Create a button below each of the Fruit buttons that allows the User to
‘sell’ one of their fruits of the same type at the current market price.
This will also remove one from their inventory. The user should be not able
to sell fruits they do not already own.

Pro Mode
Limit the application experience to five minutes. At the end, stop the
price fluctuation, sell all of the fruits in their inventory at current
market price, and then display the total money they earned from the experience.

Master Mode
Try your hand at styling everything using Bootstrap!
*/

//object - fruit - name / has cost
//object - player - cash, inv for each fruit ^
//Time Interval for Cost Change

// fruits
// Apples, Oranges, Bananas, and Grapes
var fruitArray = ["Apples", "Oranges", "Grapes", "Pears"];

var MIN_FRUIT_PRICE = 50; //in cents
var MAX_FRUIT_PRICE = 999; //in cents
var MIN_PRICE_SWING = 1;
var MAX_PRICE_SWING = 50;
var INTERVAL_TIME = 5000; //in milliseconds
var PLAYER_STARTING_CASH = 50;

//CONSTRUCTOR FUNCTION
function Fruit(name, price){
  this.name = name;
  this.price = price;
  this.container = {};
  this.updatePrice = function(){
    var priceSwing = randomNumber(MIN_PRICE_SWING, MAX_PRICE_SWING)/100;
    this.price += priceSwing;
  };
}

function Player(){
  this.cash = PLAYER_STARTING_CASH;
}

var player;

$(document).ready(function(){
    init();
    enable();
    updatePlayerDisplay();
});

function enable(){
  $("#fruitContainer").on("click", ".fruit-button", clickBuyButton);
  $("#playerContainer").on("click", ".player-fruit", clickSellButton);
  setInterval(gameLoop, INTERVAL_TIME);
}

function init(){

  player = new Player();

  for(var i = 0; i < fruitArray.length; i++){
    var startingPrice = randomNumber(MIN_FRUIT_PRICE,MAX_FRUIT_PRICE)/100;

    var newFruit = new Fruit(fruitArray[i], startingPrice);
    fruitArray[i] = newFruit;

    //invApples
    player["inv" + newFruit.name] = [];

    //test code
    newFruit.updatePrice();
  }

  console.log(player);

  for(i = 0; i < fruitArray.length; i++){
    addFruitToDom(fruitArray[i]);
  }


}

function gameLoop(){
  for(var i = 0; i < fruitArray.length; i++){
    var fruit = fruitArray[i];
    fruit.updatePrice();

    fruit.container.find(".fruit-price").text(fruit.price);
    fruit.container.data("price", fruit.price);
  }
}

function addFruitToDom(fruit){
  console.log(fruit);
  $("#fruitContainer").append("<div class='fruit-button'></div>");
  var $el = $("#fruitContainer").children().last();
  $el.append("<p>" + fruit.name + "</p>");
  $el.append("<p class='fruit-price'>" + fruit.price + "</p>");
  $el.data("name", fruit.name);
  $el.data("price", fruit.price);

  fruit.container = $el;

  $("#playerContainer").append("<div class='player-fruit'></div>");
  $el = $("#playerContainer").children().last();
  $el.data("name", fruit.name);
  $el.data("price", fruit.price);
  console.log($el.data());
  $el.append("<p id='inv-" + fruit.name + "'></p>");
  $el.children().last().text(fruit.name + ": 0");


}

function updatePlayerDisplay(){
  $("#playerCash").text("Player Cash: " + player.cash);
  for(var i = 0; i < fruitArray.length; i++){
    var fruit = fruitArray[i];
    var string = fruit.name + ": " + player["inv" + fruit.name].length;
    string += " - Average price paid: " + averageArray(player["inv" + fruit.name]);
    $("#inv-" + fruit.name).text(string);
  }
}

function clickBuyButton(){
  var fruitPrice = $(this).data("price");
  if(player.cash >= fruitPrice){
    player.cash -= fruitPrice;
    player["inv" + $(this).data("name")].push(fruitPrice);
    updatePlayerDisplay();
  }
}

function clickSellButton(){
  var invArray = player["inv" + $(this).data("name")];
  if(invArray.length > 0){
    player.cash += $(this).data("price");
    invArray.pop();
  }

  updatePlayerDisplay();
}

//Utility Function
function randomNumber(min, max){
	return Math.floor(Math.random() * (1 + max - min) + min);
}

function averageArray(array){
  var sum = 0;
  for(var i = 0; i < array.length; i++){
    sum += array[i];
  }

  var average = sum/array.length;

  if(isNaN(average)){
    average = "None Purchased";
  }

  if(array.length > 0){
    for(i = 0; i < array.length; i++){
      array[i] = average;
    }
  }

  return average;
}
