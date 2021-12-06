import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const url = "https://limitless-harbor-13365.herokuapp.com";

interface Skill {
  name: string;
  ID: number;
  hours: string;
}
function App() {
  const [state, setState] = useState<Skill[]>([]);

  const [name, setName] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [editMode, setEditMode] = useState<number>(0);

  useEffect(() => {
    getSkills();
  }, []);

  const getSkills = async () => {
    const response = await axios.get(`${url}/skills`);
    setState(response.data);
  };

  const addSkill = async () => {
    await axios.post(`${url}/skills`, {
      name,
      hours: parseInt(hours)
    });
    getSkills();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    editMode !== 0 ? await editSkill() : await addSkill();
  };

  const editSkill = async () => {
    const skill = state.find((s) => s.name === name);
    if (skill?.ID) {
      await editDatabase(skill.ID);
    } else {
      alert("Skill not found WTF");
    }
    setName("");
    setHours("");
  };

  const incrementLocalState = (id: number) => {
    const newState = state.map((skill) => {
      if (skill.ID === id) {
        return { ...skill, hours: skill.hours + 1 };
      } else {
        return skill;
      }
    });
    setState(newState);
  };

  const incrementDatabase = async (id: number): Promise<boolean> => {
    const response = await axios.put(`${url}/skills/hour/${id}`);
    return response.status === 200;
  };

  const increment = async (id: number) => {
    (await incrementDatabase(id))
      ? incrementLocalState(id)
      : alert("Something went wrong");
  };

  const initiateEditMode = (id: number) => {
    const skillName = state.find((skill) => skill.ID === id)!.name;
    setName(skillName);
    setHours(state.find((skill) => skill.ID === id)!.hours);
    setEditMode(id);
  };

  const editDatabase = async (id: number) => {
    await axios.put(`${url}/skills/${id}`, {
      name,
      hours: parseInt(hours)
    });
    getSkills();
  };

  const deleteSkill = async (id: number) => {
    await axios.delete(`${url}/skills/${id}`);
    getSkills();
  };

  return (
    <div className="App">
      <h1>The 10 Thousand Hour Rule</h1>

      <form onSubmit={handleSubmit}>
        <div className="input">
          <label>Skill</label>{" "}
          <input
            type="text"
            autoComplete="off"
            name="skill"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="input">
          <label>Hours</label>{" "}
          <input
            name="hours"
            type="text"
            autoComplete="off"
            onChange={(e) => setHours(e.target.value)}
            value={hours}
          />
        </div>

        <button type="submit">
          {editMode !== 0 ? "Save Changes" : "Add Skill"}
        </button>
      </form>

      <h2>Skills</h2>
      <div className="skills">
        {state.map((skill, index) => (
          <div key={index} className="skill">
            <h3>{skill.name}</h3>
            <p>{skill.hours}</p>
            <div>
              <button onClick={() => increment(skill.ID)}>+</button>
              <button onClick={() => initiateEditMode(skill.ID)}>
                Edit Skill
              </button>

              <button onClick={() => deleteSkill(skill.ID)}>
                Delete Skill
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
