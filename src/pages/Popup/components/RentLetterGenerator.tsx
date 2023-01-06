import React, { ChangeEvent, SetStateAction, useState } from "react";
import invokeRentalLetterGenerator from "../invokers/invokeRentalLetterFunction";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import Title from "./Title";

// const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;

export type RentLetterForm = {
  name: string,
  age: string,
  gender: string,
  smoker: string,
  pets: string,
  kids: string,
  pregnant?: string,
  occupation: string,
  jobTitle: string,
  yearlyIncome: string,
  employer: string,
}

export type RentLetterFormFields = RentLetterForm[]

const RentLetterGenerator = () => {
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [relationshipType, setRelationshipType] = useState("");
  const [formFields, setFormFields] = useState<RentLetterForm[]>([
    {
      // name: "Richard",
      // age: "24",
      // gender: "male",
      // smoker: "no",
      // pets: "0",
      // kids: "0",
      // pregnant: "no",
      // occupation: "employed",
      // jobTitle: "Technical Consultant",
      // yearlyIncome: "66000",
      // employer: "Meta",
      name: "",
      age: "",
      gender: "",
      smoker: "",
      pets: "",
      kids: "",
      pregnant: "",
      occupation: "",
      jobTitle: "",
      yearlyIncome: "",
      employer: "",
    },
  ]);

  const { enqueueSnackbar } = useSnackbar();

  const handleFormChange = (event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>, index: number | keyof RentLetterForm) => {
    let data: RentLetterForm[] | any = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // alert(inputs);
    callGenerateEndpoint();
  };

  const addFields = () => {
    let object: RentLetterForm = {
      name: "",
      age: "",
      gender: "",
      smoker: "",
      pets: "",
      kids: "",
      pregnant: "",
      occupation: "",
      jobTitle: "",
      yearlyIncome: "",
      employer: "",
    };

    setFormFields([...formFields, object]);
  };

  const removeFields = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const tenantGroup = {
    tenantDetails: formFields,
    tenantRelationship: relationshipType,
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Thinking...");
    const response = invokeRentalLetterGenerator(tenantGroup);

    const { output } = await response;
    if (output) {
      console.log("And voila...", output.text);

      setApiOutput(`${output.text}`);
      setIsGenerating(false);
      enqueueSnackbar('Letter successfully generated!', { variant: 'success' })
    } else {
      enqueueSnackbar('Error generating letter - please try again', { variant: 'error' })
    }
  };

  const onRelationshipTypeChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    console.log(event.target.value);
    setRelationshipType(event.target.value);
  };

  return (
    <div className="root">
      <title>Rental Cover Letter generator | HomeLogger</title>
      <div className="container">
        <Title title={"Cover Letter Generator"} />
        <div
          style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}
        >
          Welcome to the Rental Cover Letter Generator!
        </div>
        <br />
        <div style={{ fontSize: "18px", textAlign: "center" }}>
          Are you a tenant looking to stand out in a competitive rental market?
          Our AI-powered generator can create a personalized and convincing
          cover letter for you to present to your potential landlord.
        </div>
        <br />
        <div style={{ fontSize: "16px" }}>
          Simply input your personal details such as age, gender, whether you
          smoke, have children or pets, your salary, employer, and any other
          relevant information. Our AI generator will craft a professional and
          persuasive letter that highlights your strengths as a tenant.
        </div>
        <br />
        <div
          style={{ fontSize: "18px", textAlign: "center", fontWeight: "bold" }}
        >
          Ready to get started?
        </div>
        <br />
        <div style={{ textAlign: "center" }}>
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "12px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "150px",
            }}
            className={
              isGenerating ? "generate-button loading" : "generate-button"
            }
            onClick={callGenerateEndpoint}
          >
            {isGenerating ? (
              <>
                <CircularProgress size={24} />
                <br />
              </>
            ) : (
              ""
            )}
            Generate Cover Letter
          </button>
        </div>
        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Letter</h3>
              </div>
            </div>
            <div className="output-content">
              <pre style={{ whiteSpace: "pre-wrap" }}>{apiOutput}</pre>
            </div>
            <br />
          </div>
        )}
        <div className="App">
          <form onSubmit={handleSubmit} color="white">
            {formFields.map((form, index) => {
              return (
                <div key={index}>
                  <h3>Tenant {index + 1}</h3>
                  <div>
                    <label>
                      Enter your name:
                      <input
                        type="text"
                        name="name"
                        value={form.name || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your age:
                      <input
                        type="number"
                        name="age"
                        value={form.age || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Select your gender:
                      <select
                        name="gender"
                        value={form.gender || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Non-binary</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Are you a smoker?
                      <select
                        name="smoker"
                        value={form.smoker || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      How many pets do you have?
                      <input
                        type="number"
                        name="pets"
                        value={form.pets || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      How many kids do you have?
                      <input
                        type="number"
                        name="kids"
                        value={form.kids || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Are you pregnant?
                      <select
                        name="pregnant"
                        value={form.pregnant || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Select your occupation:
                      <select
                        name="occupation"
                        value={form.occupation || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="student">Student</option>
                        <option value="employed">Employed</option>
                        <option value="unemployed">Unemployed</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your job title (or N/A if you don't have one):
                      <input
                        type="text"
                        name="jobTitle"
                        value={form.jobTitle || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your income (£):
                      <input
                        type="number"
                        name="yearlyIncome"
                        value={form.yearlyIncome || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your employer name:
                      <input
                        type="text"
                        name="employer"
                        value={form.employer || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <button onClick={() => removeFields(index)}>Remove</button>
                </div>
              );
            })}
          </form>
          <br />
          <button onClick={addFields}>Add Another Tenant..</button>
          <br />
          <br />
          {Object.keys(formFields).length > 1 && (
            <div className="relationship-dropdown">
              <label>
                <b>How do you know each other?</b>
                <select onChange={onRelationshipTypeChange}>
                  <option value="professional sharers">
                    Professional Sharers
                  </option>
                  <option value="students">Students</option>
                  <option value="platonic friends (not in a relationship)">
                    Friends
                  </option>
                  <option value="siblings">Siblings</option>
                  <option value="cousins">Cousins</option>
                  <option value="in a relationship">In a Relationship</option>
                  <option value="married">Married</option>
                </select>
              </label>
            </div>
          )}
          <br />
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "150px",
              }}
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              {isGenerating ? (
                <>
                  <CircularProgress size={24} />
                  <br />
                </>
              ) : (
                ""
              )}
              Generate Cover Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentLetterGenerator;

// create form
// form should ask for all data points
// should have an Add Tenant button that inserts another form
// inputs from all tenants should be saved in tenantGroup object
