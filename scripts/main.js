function readValues(){
    const sleep_in_class = document.getElementById('sleep_in_class').checked;
    const phone = document.getElementById('go_on_phone').checked;
    const study_daily = document.getElementById('study_daily').checked;
    const does_homework = document.getElementById('does_homework').checked;
    const last_gpa = document.getElementById('last_gpa')

    const inputData = [];

    if(last_gpa.value === ''){
        inputData.push(0);
    } else {
        inputData.push(parseInt(last_gpa.value))
    }

    const values = [sleep_in_class, phone, study_daily, does_homework]

    for(const value of values){
        if(value){
            inputData.push(1.0)
        } else {
            inputData.push(0.0)
        }
    }

    return inputData
}

async function load() {
  const model = await tf.loadLayersModel("Model/model.json");

  // Load scaler stats from JSON
  const response = await fetch("Model/scaler_stats.json");
  const scalerStats = await response.json();
  const mean = scalerStats.mean;
  const scale = scalerStats.scale;

  // Input data
  const rawInputData = readValues();

  console.log(rawInputData)

  // Scale the input data: (x - mean) / scale
  const scaledInputData = rawInputData.map((x, i) => (x - mean[i]) / scale[i]);

  // Create a tensor with the correct shape [1, 5]
  const inputData = tf.tensor2d([scaledInputData], [1, 5]);

  // Make predictions
  const prediction = model.predict(inputData);

  // Retrieve and print the prediction result
  const predictionData = await prediction.data();

  if(document.getElementById("Results")){
    document.getElementById("Results").remove();
  }

  const newHtml = document.createElement("h1");
  newHtml.id = "Results"
  newHtml.innerHTML = `Prediction Data: ${Number(predictionData).toFixed(2)}%`
  document.body.appendChild(newHtml)
}

document.querySelector('#predict').addEventListener("click", () => {
    load();
});
