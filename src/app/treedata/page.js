"use client";
import React, { useState, useEffect } from "react";

const ShowData = ({ node, margin = 10, onNodeCheck, parentChecked }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        // If the parent is checked, check the node as well
        if (parentChecked !== undefined) {
            setIsChecked(parentChecked);
            updateChildrenCheck(node.children, parentChecked);
        }
    }, [parentChecked, node.children]);

    // Toggle the expanded state of the current node
    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
    };

    // Handle checkbox change and propagate the state to children nodes
    const handleCheckboxChange = () => {
        const newChecked = !isChecked;
        console.log(`Toggling isChecked from ${isChecked} to ${newChecked}`);
        setIsChecked(newChecked);
        // Update children checkboxes if state is changing
        updateChildrenCheck(node.children, newChecked);
        // Notify the parent node (if applicable)
        if (onNodeCheck) {
            console.log(`Calling onNodeCheck with ${newChecked}`);
            onNodeCheck(newChecked);
        }
    };

   // Recursive function to update the checked state of children nodes
const updateChildrenCheck = (children, newChecked) => {
    if (children) {
        console.log(`Updating children with newChecked = ${newChecked}`);
        children.forEach((child) => {
            console.log(`Updating child ${child.name}'s isChecked to ${newChecked}`);
            // Update the child node's isChecked property
            child.isChecked = newChecked;
            // Recursively update child nodes
            if (child.children) {
                updateChildrenCheck(child.children, newChecked);
            }
        });
    }
};


    // Handle the checkbox change of a child node and update parent state
    const handleChildCheck = (child, newChecked) => {
        console.log(`handleChildCheck: Child ${child.name} check changed to ${newChecked}`);
        // Update child's state
        child.isChecked = newChecked;
        // Update the state of child nodes
        updateChildrenCheck(child.children, newChecked);
        // Check if all children are checked
        const allChecked = node.children.every((c) => c.isChecked);
        console.log(`All children checked: ${allChecked}`);
        setIsChecked(allChecked);
      
    };

    // Recursive function to render child nodes
    const renderChildNodes = (children, margin) => {
        console.log(`Rendering child nodes for ${node.name} with margin ${margin}`);
        return children.map((child, index) => (
            <ShowData
                key={child.id || index}
                node={child}
                margin={margin + 10}
                onNodeCheck={(checked) => handleChildCheck(child, checked)}
                parentChecked={isChecked}
            />
        ));
    };

    return (
        <div style={{ marginLeft: `${margin}px` }}>
            {/* Render the current node */}
            <div className="flex items-center cursor-pointer">
                {/* Checkbox for the current node */}
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                {/* Display node name */}
                <span onClick={handleExpandClick} className="ml-2">
                    {node.name}
                </span>
            </div>
            {/* Render children if the current node is expanded */}
            {isExpanded && node.children && (
                <div>{renderChildNodes(node.children, margin)}</div>
            )}
        </div>
    );
};

// Main component for rendering the tree structure
export default function RenderComponent() {
    // JSON data stored in a state variable
    const treeData = {
        id: 1,
        name: "Parent 1",
        children: [
            {
                id: 2,
                name: "Child1",
                children: [
                    {
                        id: 3,
                        name: "Grand child 1",
                        children: [
                            {
                                id: 4,
                                name: "Grand Grand child 1",
                                children: [],
                            },
                            {
                                id: 5,
                                name: "Grand Grand child 2",
                                children: [],
                            },
                            {
                                id: 6,
                                name: "Grand Grand child 3",
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 7,
                        name: "Grand child 2",
                        children: [],
                    },
                ],
            },
            {
                id: 8,
                name: "Child2",
                children: [
                    {
                        id: 9,
                        name: "Grand child 1",
                        children: [
                            {
                                id: 10,
                                name: "Grand Grand child 1",
                                children: [],
                            },
                        ],
                    },
                    {
                        id: 11,
                        name: "Grand child 2",
                        children: [
                            {
                                id: 12,
                                name: "Grand Grand child 1",
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ],
    }

    console.log("RenderComponent: Initial treeData", treeData);

    return (
        <div className="w-full h-full flex justify-center items-center mt-4">
            {/* Render the top-level tree data */}
            <ShowData node={treeData} />
        </div>
    );
}
