import React, { useEffect, useState } from "react";
import { fetchAllUsers } from "../../admin_services/userApi";
import "./DashBoardTable.css";

const DashboardTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email address", accessor: "email" },
    { header: "First name", accessor: "first_name" },
    { header: "Last name", accessor: "last_name" },
    { header: "Staff status", accessor: "is_staff" },
  ];

  useEffect(() => {
    const getAllUser = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUsers();
        setData(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUser();
  }, []);

  const actions = [
    { label: "Edit", type: "warning", onClick: (row) => handleEdit(row) },
    { label: "Delete", type: "danger", onClick: (row) => handleDelete(row) },
  ];

  const handleEdit = (row) => {
    console.log("Edit", row);
    // Implement your edit logic here
  };

  const handleDelete = (row) => {
    console.log("Delete", row);
    // Implement your delete logic here
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="table-responsive mt-4">
      <table className="table table-hover table-striped align-middle">
        <thead className="table-success">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col">
                {col.header}
              </th>
            ))}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col.accessor]}</td>
              ))}
              <td>
                {actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    className={`btn btn-${
                      action.type || "primary"
                    } btn-sm me-2`}
                    onClick={() => action.onClick(row)}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
