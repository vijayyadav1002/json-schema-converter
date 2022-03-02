import React, {useState} from 'react';
import jsBeautify from 'js-beautify';
import toJsonSchema from 'generate-schema';
import './App.css';

const addRequiredProperties = (data)=> {
  if (data.type === 'array') {
    return addRequiredProperties(data.items);
  }

  if (data.type === 'object') {
    data.required = Object.keys(data.properties);
    for(let i = 0; i < data.required.length; i++) {
      addRequiredProperties(data.properties[data.required[i]]);
    }
  }
  return data;
};

function App() {
  const [error, setError] = useState('');
  const [required, setRequired] = useState(true);
  const [isBeautify, setIsBeautify] = useState(true);
  const [jsonInput, setJsonInput] = useState('{"name": "Dan"}');
  const [schemaInput, setSchemaInput] = useState('{}');
  const [isChecked, setIsChecked] = useState(true);
  const convertToSchema = (event) => {
    event && event.preventDefault();
    try {
      const toSchema = toJsonSchema.json(JSON.parse(jsonInput));
      const schema = required ? addRequiredProperties(toSchema) : toSchema
      schema.additionalProperties = isChecked;
      delete schema.$schema;
      const schemaToString = JSON.stringify(schema);
      setSchemaInput(isBeautify ? jsBeautify.js(schemaToString) : schemaToString);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };
  const clear = () => {
    setJsonInput('');
    setSchemaInput('');
  }
  return (
      <div className="App">
        <header className="App-header">
          <h1>Convert JSON to JSON Schema</h1>
          <textarea rows={20} cols={50} value={jsonInput} onChange={e => setJsonInput(e.target.value)}/>
          {error && <p>{error}</p>}
          <div className='button-group'>
            <button onClick={convertToSchema}>Convert</button>
            <button onClick={clear}>Clear</button>
            <label htmlFor='additional-properties'>
              <input type='checkbox' checked={isChecked} id='additional-properties' onChange={() => setIsChecked(!isChecked)}/>
              <span>Additional Properties</span>
            </label>
            <label htmlFor='all-required'>
              <input type='checkbox' checked={required} id='all-required' onChange={() => setRequired(!required)}/>
              <span>All Required</span>
            </label>
            <label htmlFor='beautify'>
              <input type='checkbox' checked={isBeautify} id='beautify' onChange={() => setIsBeautify(!isBeautify)}/>
              <span>Beautify</span>
            </label>
          </div>
          <textarea rows={20} cols={50} value={schemaInput} readOnly/>
        </header>
      </div>
  );
}

export default App;
