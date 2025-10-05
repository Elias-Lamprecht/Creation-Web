let TechFieldNumber = 0;
let TechBarFieldNumber = 0;

document.getElementById("ImportInput").addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) {
        console.warn("No file selected.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const fileContent = e.target.result;

        if (!fileContent) {
            console.error("File is empty or unreadable.");
            return;
        }

        try {
            const jsonData = JSON.parse(fileContent);
            console.log("Parsed JSON:", jsonData);
            ImportData(jsonData);
        } catch (err) {
            console.error("Error parsing JSON file:", err.message);
        }
    };

    reader.onerror = function () {
        console.error("Error reading file:", reader.error);
    };

    reader.readAsText(file);
});


function AddNewTechField(Text) {
    const TechInputWrapper = document.getElementById("TechInputWrapper");
    const TechSingleInputWrapper = document.createElement("div");
    const TechInput = document.createElement("input");
    const DeleteTechInputButton = document.createElement("button");

    // Create a unique ID for each new field
    const currentTechFieldID = "TechSingleInputWrapper_" + TechFieldNumber;
    TechSingleInputWrapper.id = currentTechFieldID;
    TechSingleInputWrapper.classList.add("TechSingleInputWrapper");

    TechInput.classList.add("TechInput");
    TechInput.placeholder = "Tech...";
    TechInput.type = "text";
    TechInput.value = Text;
    console.log(Text)
    console.log(TechInput.innerText)

    // Attach the event handler to the delete button
    DeleteTechInputButton.onclick = function() {
        DeleteTechField(currentTechFieldID);
    };
    DeleteTechInputButton.innerText = "Delete";

    TechSingleInputWrapper.appendChild(TechInput);
    TechSingleInputWrapper.appendChild(DeleteTechInputButton);
    TechInputWrapper.appendChild(TechSingleInputWrapper);

    TechFieldNumber++;
}

function AddNewTechBarField(key, value) {
    const TechBarInputWrapper = document.getElementById("TechBarInputWrapper");
    const TechBarSingleInputWrapper = document.createElement("div");
    const TechBarNameInput = document.createElement("input");
    const TechBarNumberInput = document.createElement("input");
    const DeleteTechBarInputButton = document.createElement("button");

    // Create a unique ID for each new field
    const currentTechFieldID = "TechBarSingleInputWrapper_" + TechBarFieldNumber;
    TechBarSingleInputWrapper.id = currentTechFieldID;

    TechBarSingleInputWrapper.classList.add("TechBarInputWrapper");

    TechBarNameInput.classList.add("TechBarNameInput");
    TechBarNameInput.type = "text";
    TechBarNameInput.placeholder = "Techbar Name";
    TechBarNameInput.value = key;
    TechBarNumberInput.classList.add("TechBarNumberInput");
    TechBarNumberInput.type = "number";
    TechBarNumberInput.placeholder = "0";
    TechBarNumberInput.min = 0;
    TechBarNumberInput.max = 100;
    TechBarNumberInput.value = value;


    // Attach the event handler to the delete button
    DeleteTechBarInputButton.onclick = function() {
        DeleteTechField(currentTechFieldID);
    };
    DeleteTechBarInputButton.innerText = "Delete";
    DeleteTechBarInputButton.id = "DeleteTechBarInputButton";

    TechBarSingleInputWrapper.appendChild(TechBarNameInput);
    TechBarSingleInputWrapper.appendChild(TechBarNumberInput);
    TechBarSingleInputWrapper.appendChild(DeleteTechBarInputButton);
    TechBarInputWrapper.appendChild(TechBarSingleInputWrapper);

    TechBarFieldNumber++;
}

function DeleteTechField(Item) {
    const element = document.getElementById(Item);
    console.log("Deleting: " + Item);
    if (element) {
        element.remove();
    }
}

function Download() {
    let TechWrapper = document.getElementById("TechInputWrapper");
    let tech = [];
    for (let i = 0; i < TechWrapper.children.length; i++) {
        current_tech_wrapper = TechWrapper.children[i];
        current_tech = current_tech_wrapper.children[0];
        tech.push(current_tech.value);
    }
    console.log(tech);

    let TechBarWrapper = document.getElementById("TechBarInputWrapper");
    let techbar = {};
    for (let i = 0; i < TechBarWrapper.children.length; i++) {
        current_techbar_wrapper = TechBarWrapper.children[i];
        current_techbar_value = current_techbar_wrapper.children[0];
        current_techbar_name = current_techbar_wrapper.children[1];
        techbar[current_techbar_value.value] = Number(current_techbar_name.value);
    }

    Data = {
        "title": document.getElementById("TitleBox").value,
        "image": document.getElementById("ImageFileNameBox").value,
        "description": document.getElementById("DescriptionBox").value,
        "type": document.getElementById("TypeSelect").value,
        "start_date": document.getElementById("StartDateBox").value,
        "end_date": document.getElementById("EndDateBox").value,
        "github": document.getElementById("GithubURLBox").value,
        "live": document.getElementById("LiveDemoURLBox").value,
        "status": document.getElementById("StatusSelect").value,
        "visibility": document.getElementById("VisibilitySelect").value,
        "tech": tech,
        "techbar": techbar
    }
    console.log(Data)

    const jsonString = JSON.stringify(Data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = document.getElementById("FileNameBox").value + ".json";
    link.click();
    URL.revokeObjectURL(link.href);

}

function ImportData(data) {

    document.getElementById("TitleBox").value = data.title;
    document.getElementById("ImageFileNameBox").value = data.image;
    document.getElementById("DescriptionBox").value = data.description;
    document.getElementById("TypeSelect").value = data.type;
    document.getElementById("StartDateBox").value = data.start_date;
    document.getElementById("EndDateBox").value = data.end_date;
    document.getElementById("GithubURLBox").value = data.github;
    document.getElementById("LiveDemoURLBox").value = data.live;
    document.getElementById("StatusSelect").value = data.status;
    document.getElementById("VisibilitySelect").value = data.visibility;

    if (Array.isArray(data.tech) && data.tech.length > 0) {
        // Put the first tech item into a special field
        document.getElementById("DefaultTechInput").value = data.tech[0];

        // For the rest of the tech array (starting from index 1), add new tech fields
        for (let i = 1; i < data.tech.length; i++) {
            AddNewTechField(data.tech[i]);
        }
    }
    if (data.techbar && typeof data.techbar === 'object' && !Array.isArray(data.techbar)) {
        const entries = Object.entries(data.techbar);

        if (entries.length > 0) {
            // Set the first key/value to special inputs
            const [firstKey, firstValue] = entries[0];
            document.getElementById("DefaultTechBarNameInput").value = firstKey;
            document.getElementById("DefaultTechBarNumberInput").value = firstValue;

            // Add the rest as new tech bar fields dynamically
            for (let i = 1; i < entries.length; i++) {
                const [key, value] = entries[i];
                AddNewTechBarField(key, value);
            }
        }
    }
}
