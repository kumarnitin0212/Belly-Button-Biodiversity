function init() {
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        var firstSample = sampleNames[0];
        buildPlots(firstSample);
        updateMetadata(firstSample);
    });
}
init();
function optionChanged(newSample) {
    updateMetadata(newSample);
    buildPlots(newSample);
}
function updateMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var washFreq = result.wfreq;
        console.log(`check: ${washFreq}`);
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}
function buildPlots(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data);
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot("bar", barData, barLayout);
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
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // WFREQ FILTERING 
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var washFreq = result.wfreq;

        var gaugeData = [
            {
                domain: {x: [0, 1], y: [0, 1] },
                marker: {size: 28, color: 'white'},
                type: "indicator",
                mode: "gauge+number",
                value: washFreq,
                title: 'Belly Button Washing Frequency <br> Scrubs per Week',
                gauge: {
                    bar: {color: 'white'},
                    axis: {range: [null, 10]},
                    bgcolor: 'green'},
            }
        ];
        
        var gaugeLayout = {
                width: 600,
                height: 450,
                margin: {t: 0, b: 0},
            };
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}