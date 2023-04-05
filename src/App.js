import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
	let list = localStorage.getItem("list");
	if (list) {
		return JSON.parse(localStorage.getItem("list"));
	} else {
		return [];
	}
};

function App() {
	const [item, setItem] = useState("");
	const [list, setList] = useState(getLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [modifiedItemId, setModifiedItemId] = useState("");
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});

	const handleSubmit = (eve) => {
		eve.preventDefault();
		// console.log(eve);

		if (!item) {
			//alert
			showAlert(true, "Please enter a value", "danger");
		} else if (item && isEditing) {
			//Editing alert
			setList(
				list.map((each) => {
					if (each.id === modifiedItemId) {
						return { ...each, title: item };
					}
					return each;
				})
			);
			setIsEditing(false);
			setItem("");
			showAlert(true, "item Modified", "success");
		} else {
			//apending items
			const newItem = { id: new Date().getTime().toString(), title: item };
			setList([...list, newItem]);
			showAlert(true, `${newItem.title} Added`, "success");
			setItem("");
		}
	};

	//all functions goes here

	const showAlert = (show = false, msg = "", type = "") => {
		setAlert({ show, msg, type });
	};

	const clearList = () => {
		setList([]);
		showAlert(true, "All item removed", "danger");
	};

	const removeItems = (id) => {
		const deletedItem = list.find((each) => each.id === id);
		setList(
			list.filter((item) => {
				showAlert(true, `${deletedItem.title} is removed`, "danger");
				return item.id !== id;
			})
		);
	};

	const editList = (id) => {
		const modifiedItem = list.find((each) => each.id === id);
		setIsEditing(true);
		setItem(modifiedItem.title);
		setModifiedItemId(id);
	};

	useEffect(() => {
		localStorage.setItem("list", JSON.stringify(list));
	}, [list]);

	return (
		<section className="section-center">
			<form className="grocery-form" onSubmit={handleSubmit}>
				<h3>Grocery Items</h3>
				{alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
				<div className="form-control">
					<input
						type="text"
						value={item}
						onChange={(eve) => setItem(eve.target.value)}
						className="grocery"
						placeholder="e.g. Eggs"
						// name="listItem"
					/>
					<button type="submit" className="submit-btn">
						{" "}
						{isEditing ? "Edit" : "Submit"}{" "}
					</button>
				</div>
			</form>
			{list.length > 0 && (
				<div className="grocery-container">
					<List list={list} removeItems={removeItems} editList={editList} />
					<button className="clear-btn" onClick={clearList}>
						Clear All
					</button>
				</div>
			)}
		</section>
	);
}

export default App;
