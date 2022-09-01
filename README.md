# twohand-admin

### page-table
| props | 类型     | 示例 |
| :---: | -------- | ---- |
| func  | function |      |
|       |          |      |
|       |          |      |

json-form

| props     | 类型   | 示例    |
| --------- | ------ | ------- |
| form      | object | {}      |
| direction | string | h/other |
| options   | array  | []      |



page-table.func示例

```
{
    columns:[
    	{
    		key:"columnkey",
    		label:"columnname",
    		slot:"use slot"
    	}
    ],
    reqOptions:{
    	list:{
    		method,
    		url
    	}, 分页列表
    	insert，新增
    	update, 更新
    	remove, 删除
    }，
    search:json-form props,
    opration:json-form props,
    addField:json-form props,
    updateField:json-form props,
    
}
```

json-form.options示例

```
[
    {
		key:"fieldKey",
		label:"fieldshowname",
		type:component-name
		required:Boolean , 不能为空
		rules:[]
    }
]
```

