import React, {useState} from 'react';
// @ts-ignore
import toJsonSchema from 'to-json-schema';
import './App.css';

function App(): JSX.Element {
    const [error, setError] = useState('');
    const [required, setRequired] = useState(true);
    const [jsonInput, setJsonInput] = useState('{"name": "Dan"}');
    const [schemaInput, setSchemaInput] = useState('{}');
    const [isChecked, setIsChecked] = useState(true);
    const convertToSchema = (event: any) => {
        event && event.preventDefault();
        try {
            const schema = toJsonSchema(JSON.parse(jsonInput), {required});
            if (isChecked) {
                schema.additionalProperties = isChecked;
            }
            setSchemaInput(JSON.stringify(schema));
            setError('');
        } catch (e: any) {
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
                </div>
                <textarea rows={20} cols={50} value={schemaInput}/>
            </header>
        </div>
    );
}

export default App;
