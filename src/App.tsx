import React, {useState} from 'react';
// @ts-ignore
import toJsonSchema from 'generate-schema';
import './App.css';
// @ts-ignore
import jsBeautify from 'js-beautify';
// @ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';

interface SchemaType {
    type: string,
    items: SchemaType,
    properties: Partial<any>,
    required: Array<string>
}

const addRequiredProperties = (data: SchemaType): SchemaType => {
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

function App(): JSX.Element {
    const [error, setError] = useState('');
    const [required, setRequired] = useState(true);
    const [beautify, setBeautify] = useState(true);
    const [jsonInput, setJsonInput] = useState('{"name": "Dan"}');
    const [schemaInput, setSchemaInput] = useState('{}');
    const [isChecked, setIsChecked] = useState(true);
    const [copy, setCopy] = useState(false);
    const setCopied = () => {
        setCopy(true);
        setTimeout(() => setCopy(false), 1000);
    }
    const convertToSchema = (event: React.MouseEvent<HTMLButtonElement>) => {
        event && event.preventDefault();
        try {
            const toSchema = toJsonSchema.json(JSON.parse(jsonInput));
            const schema = required ? addRequiredProperties(toSchema) : toSchema
            schema.additionalProperties = isChecked;
            delete schema.$schema;
            const schemaStringify = JSON.stringify(schema);
            setSchemaInput(beautify ? jsBeautify.js(schemaStringify) : schemaStringify);
            setError('');
        } catch (e: any) {
            setError(e.message);
        }
    };
    const clear = () => {
        setJsonInput('{"name": "Dan"}');
        setSchemaInput('');
        setError('');
    }
    return (
        <div className="App">
            <h1>Convert JSON to JSON Schema</h1>
            <header className="App-header">
                <textarea rows={10} cols={50} value={jsonInput} onChange={e => setJsonInput(e.target.value)}/>
                <div className='button-group'>
                    <button onClick={convertToSchema}>Convert</button>
                    <button onClick={clear}>Reset</button>
                    <CopyToClipboard text={schemaInput}
                                     onCopy={() => setCopied()}>
                        <button>Copy</button>
                    </CopyToClipboard>
                    {copy ? <span className='copied'>Copied.</span> : null}
                    <div className='checkbox-group'>
                        <label htmlFor='additional-properties'>
                            <input type='checkbox' checked={isChecked} id='additional-properties' onChange={() => setIsChecked(!isChecked)}/>
                            <span>Additional Properties</span>
                        </label>
                        <label htmlFor='all-required'>
                            <input type='checkbox' checked={required} id='all-required' onChange={() => setRequired(!required)}/>
                            <span>All Required</span>
                        </label>
                        <label htmlFor='beautify'>
                            <input type='checkbox' checked={beautify} id='beautify' onChange={() => setBeautify(!beautify)}/>
                            <span>Beautify</span>
                        </label>
                    </div>
                    {error && <p style={{color: "red"}}>{error}</p>}
                </div>
                <textarea rows={10} cols={50} value={schemaInput} readOnly/>
            </header>
        </div>
    );
}

export default App;
