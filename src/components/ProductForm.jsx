import React, { useState, useEffect } from 'react';
import { Upload, Button, Form, Input, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProductForm = ({ userId, onClose }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            let imageUrl = '';

            // Handle file upload if a file is selected
            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj);

                const response = await axios.post('http://localhost:3001/products/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                imageUrl = response.data.fileUrl; // Get uploaded file URL
            }

            const dataToSubmit = {
                ...values,
                userId,
                status: 'available',
                price: Number(values.price), // Ensure price is a number
                categoryId: Number(values.categoryId), // Ensure categoryId is a number
                image: imageUrl,
            };

            await axios.post('http://localhost:3001/products/create', dataToSubmit);

            message.success('Product created successfully!');
            setFileList([]);
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Error creating product:', error.response ? error.response.data : error.message);
            message.error('Failed to create product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            <Form.Item
                name="name"
                label="ชื่อสินค้า"
                rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}
            >
                <Input placeholder="ชื่อสินค้า" />
            </Form.Item>

            <Form.Item
                name="description"
                label="รายละเอียดสินค้า"
                rules={[{ required: true, message: 'กรุณากรอกรายละเอียดสินค้า' }]}
            >
                <Input.TextArea placeholder="รายละเอียดสินค้า" />
            </Form.Item>

            <Form.Item
                name="price"
                label="ราคาประเมิน"
                rules={[{ required: true, message: 'กรุณากรอกราคา' }]}
            >
                <Input type="number" min={0} placeholder="ราคาประเมิน" />
            </Form.Item>

            <Form.Item
                name="categoryId"
                label="ประเภทสินค้า"
                rules={[{ required: true, message: 'กรุณาเลือกประเภทสินค้า' }]}
            >
                <Select placeholder="เลือกประเภท">
                    {categories.map((category) => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="image"
                label="รูปสินค้า"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
            >
                <Upload
                    listType="picture"
                    maxCount={1}
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false} // Prevent automatic upload
                >
                    <Button icon={<UploadOutlined />}>อัปโหลดรูป</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>
                        โพสต์สินค้า
                    </Button>
                    <Button onClick={onClose}>
                        ยกเลิก
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
