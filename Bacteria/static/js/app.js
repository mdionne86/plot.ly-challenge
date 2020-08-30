// set up the bar graph
function DrawBargraph(desiredSampleID) {
    console.log("DrawBargraph: sample = ", desiredSampleID);

    // grab the data
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == desiredSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse()

        // bar plot
        var barData = [
        {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h",
        }
    ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, 1: 150}
        };
    
        Plotly.newPlot("bar", barData, barLayout);
    });
}

// set up the bubble chart
function DrawBubbleChart(desiredSampleID) {
    console.log("DrawBubbleChart: sample = ", desiredSampleID);

    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == desiredSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t : 0},
            xaxis: { title: "OTU ID"},
            margin: {t : 30}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// set up the bonus gauge chart
function DrawGaugeChart(desiredSampleID) {
     console.log("DrawGuageChart: sample = ", desiredSampleID);

     d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        
        var resultArray = metadata.filter(sampleObj => sampleObj.id == desiredSampleID);
        var result = resultArray[0];

        var wfreq = result.wfreq;

        var level = parseFloat(wfreq) * 20;

          // Trig to calc meter point
        var degrees = 180 - level;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // set the path    
        var mainPath = "M -.0 -0.05 L .0 0.05 L ";
        var pathX = String(x);
        var space = " ";
        var pathY = String(y);
        var pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var gaugeData = [
            {
              type: "scatter",
              x: [0],
              y: [0],
              marker: { size: 12, color: "850000" },
              showlegend: false,
              name: "Freq",
              text: level,
              hoverinfo: "text+name"
            },
            {
              values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
              rotation: 90,
              text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              textinfo: "text",
              textposition: "inside",
              marker: {
                colors: [
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)"
                ]
              },
              labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              hoverinfo: "label",
              hole: 0.5,
              type: "pie",
              showlegend: false
            }
        ];

        var gaugeLayout = {
            shapes: [
              {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                  color: "850000"
                }
              }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            height: 500,
            width: 500,
            xaxis: {
              zeroline: false,
              showticklabels: false,
              showgrid: false,
              range: [-1, 1]
            },
            yaxis: {
              zeroline: false,
              showticklabels: false,
              showgrid: false,
              range: [-1, 1]
            }
          };

        Plotly.newPlot("gauge", gaugeData, gaugeLayout);        
     });
}

// set up the metadata box
function ShowMetadata(desiredSampleID) {
    console.log("ShowMetadata: sample = ", desiredSampleID);

    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        
        var resultArray = metadata.filter(sampleObj => sampleObj.id == desiredSampleID);
        var result = resultArray[0];
        console.log(result);

        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            var textToShow = `${key.toUpperCase()}: ${value}`;
            PANEL.append("h6").text(textToShow);
        });
    });
}

// watch for the id change
function optionChanged(newSampleID){
    console.log("Dropdown changed to: ", newSampleID);

    ShowMetadata(newSampleID);
    DrawBargraph(newSampleID);
    DrawBubbleChart(newSampleID);
    DrawGaugeChart(newSampleID);
}

// initialize the plot elements
function init() {
    console.log("Initializing screen");

    // Populate the dropdown box with all ID's
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sampleID) => {
            selector
                .append("option")
                .text(sampleID)
                .property("value", sampleID);        
        });
    var sampleID = sampleNames[0];

    DrawBargraph(sampleID);
    DrawBubbleChart(sampleID);
    ShowMetadata(sampleID);
    DrawGaugeChart(sampleID);
    });
}

init();