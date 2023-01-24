let arr = [2, 4, 3];
let arr2 = [...arr]; 
let num = arr.length;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let width = canvas.width / num;
let height = canvas.height / (Math.max.apply(null, arr) + 1);
let runAnim = false;
let i = 0;
let j = 0;
let swap = false;

function updateParams(textParams){
  runAnim = false;
  i = 0;
  j = 0;
  swap = false;
  console.log("upd")
  const list = textParams.split(',');
  const numberList = list.map(x => parseInt(x));
  arr = numberList;
  console.log(arr)
  arr2 = [...arr];
  num = arr.length;
  width = canvas.width / num;
  height = canvas.height / (Math.max.apply(null, arr) + 1);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let k = 0; k < num; k++) {
      ctx.fillStyle = "red";
      ctx.fillRect(k * width, canvas.height - arr2[k] * height, width, arr2[k] * height);
  }
}

function saveParams(numbers){
    fetch('/db/param', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          numberList: numbers
      })
    })
    .then((result) => {
      console.log("succ log.js/15");
      if(result.status == 400){
        localStorage.setItem('list', numbers);
      }
      
    })
    .catch((error) => {
      console.log('catch');
      console.error('Error: log.js/18', error);
    });
}

function addNumber(){
  const numbers = document.getElementById("num").value;
  saveParams(numbers);
  console.log(arr);
}

function getNumber(){
  fetch('/db/param', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((result) => {
    updateParams(result.result);
  })
  .catch((error) => {
    updateParams(localStorage.getItem('list'));
    console.error('Error: log.js/18', error);
  });
}

function startAnimate(){
  runAnim = true;
  animate();
}

ctx.fillStyle = "white";
ctx.fillRect(0, 0, 800, 400);

const fps = 2

function animate() {
  if(runAnim == true){
    setTimeout(()=>requestAnimationFrame(animate), 1000/fps);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (swap == true){
      for (let k = 0; k < num; k++) {
        if(k == j || k == j - 1){
          ctx.fillStyle = "orange";
        }
        else if(k >= num-i){
          ctx.fillStyle = "green";
        }
        else {
          ctx.fillStyle = "red";
        }
          ctx.fillRect(k * width, canvas.height - arr2[k] * height, width, arr2[k] * height);
      }
      swap = false;
      return;
    }
    if (i < num) {
      if (j < num - i - 1) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swap = true;
        }
        j++;
      } else {
          j = 0;
          i++;
      }
    }
    for (let k = 0; k < num; k++) {
      if(k == j || k == j - 1){
        ctx.fillStyle = "yellow";
      }
      else if(k >= num-i){
        ctx.fillStyle = "green";
      }
      else {
        ctx.fillStyle = "red";
      }
        ctx.fillRect(k * width, canvas.height - arr2[k] * height, width, arr2[k] * height);
    }
    arr2 = [...arr];
  }
}

