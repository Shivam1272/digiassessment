import './App.css';
import { useState } from 'react';
import { Button, Table, Modal  } from 'antd';
function App() {
  const [data, setData] = useState([{
    row:1,
    name: "Shivam",
    location:"Thane",
    cgpa:"9.29"
  }])

  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [cgpa, setCgpa] = useState("")

  const column = [
    {
      title:'Row',
      dataIndex:'row',
      key:'row',
      sorter: (a,b) => a.row - b.row
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a,b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a,b) => a.location.localeCompare(b.location)
    },
    {
      title: 'CGPA',
      dataIndex: 'cgpa',
      key: 'cgpa',
      sorter: (a,b) => a.cgpa - b.cgpa
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (_, record) => {
        return(
            <div> 
                <Button onClick={showModal}>
                  Edit
                </Button>
                <Button >
                  Delete
                </Button>
            </div>
        );
        }
    }
]

const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    handleSubmit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = () => {
    // e.preventDefault();
    if(name==="" || location ==="" || cgpa === ""){
      alert("please provide all data")
    }else{
      const newEntry = {
        row: data.length + 1,
        name: name,
        location: location,
        cgpa: cgpa
      }
      data.push(newEntry);
    }
  }
  console.log("o",data)
  return (
    <div className="App">
      <Table rowKey='row' columns={column} dataSource={[...data]}/>
      <Button type="primary" onClick={showModal}>
        Add
      </Button>
      <Modal title="Details"  open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <form onSubmit={handleSubmit} className='form'>
          <input value={name} type='text' placeholder='Enter Name' onChange={(e) => setName(e.target.value)} required/>
          <input value={location} type='text' placeholder='Enter Location'onChange={(e) => setLocation(e.target.value)} required/>
          <input value={cgpa} type='text' placeholder='Enter CGPA' onChange={(e) => setCgpa(e.target.value)} required/>
        </form>
      </Modal>
    </div>
  );
}

export default App;
