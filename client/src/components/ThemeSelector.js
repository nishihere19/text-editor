import {Select} from "antd";
import React from "react";

const { Option } = Select;

let ThemeSelector = (props) => {

    let onSelect = (value) => {
        props.changeTheme(value)
    }

    return (
        <Select defaultValue="github" style={{ width: 100 }} bordered={false} onSelect={onSelect}>
            <Option value="github">GitHub</Option>
            <Option value="eclipse">Eclipse</Option>
            <Option value="twilight">Twilight</Option>
            <Option value="xcode">XCode</Option>
            <Option value="monokai">Monokai</Option>
        </Select>
    )
}

export default ThemeSelector