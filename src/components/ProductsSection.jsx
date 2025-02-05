import React from 'react';
import { Card, Dropdown, Menu, Button, Avatar, Input, Modal, Tag } from 'antd';
import { EllipsisOutlined, CommentOutlined, SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProductForm from './ProductForm';
import OfferForm from './OfferForm';
import OffersDetail from './OfferDetails';

const { confirm } = Modal;

const ProductsSection = ({ 
  user, 
  filteredProducts, 
  showProductForm, 
  toggleProductForm, 
  handleReportProduct, 
  handleDeleteProduct, 
  handleExchangeClick, 
  selectedProduct, 
  showOfferForm, 
  handleCloseOfferForm, 
  showOffersDetail, 
  handleCloseOffersDetail, 
  dropdownProductId, 
  setDropdownProductId,
  searchProduct,
  handleProductClick,
  handleProfileClick
}) => {
  
  const handleDeleteConfirm = (productId) => {
    confirm({
      title: 'คุณต้องการลบโพสต์นี้หรือไม่?',
      icon: <ExclamationCircleOutlined />,
      content: 'การลบโพสต์ไม่สามารถเลียกคืนได้',
      okText: 'ยืนยัน',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        handleDeleteProduct(productId);
      },
    });
  };

  const renderDropdownMenu = (product) => (
    <Menu>
      {user.id !== product.user.id && (
        <Menu.Item onClick={() => handleReportProduct(product.id)}>รายงานโพสต์</Menu.Item>
      )}    
      {user.id === product.user.id && (
        <Menu.Item onClick={() => handleDeleteConfirm(product.id)}>ลบโพสต์</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="products-section">
      {showProductForm && <ProductForm userId={user.id} onClose={toggleProductForm} />}

      <div className="post-area">
        <div className="post-input">
          <Avatar src={user.profilePicture || '/default-profile.png'} size="large" />
          <Input
            onClick={toggleProductForm}
            placeholder={`ต้องการโพสต์สินค้าไหม, ${user.firstName}?`}
            readOnly
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        </div>
      </div>

      {filteredProducts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงลำดับจากใหม่ไปเก่า
        .map((product) => (
          <Card
            key={product.id}
            hoverable
            style={{ margin: '16px 0' }}
            cover={
              <div>
                <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', margin: '5px' }}>{product.name}</div>
                <img 
                  src={product.image || '/default-product.png'} 
                  alt={product.name} 
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: 'pointer', width: '300px', height: '300px', objectFit: 'cover', display: 'block', margin: '0 auto',borderRadius: '5px' }}
                />             
              </div>
            }
            actions={[
              <Button
                icon={<CommentOutlined />}
                onClick={() => handleProductClick(product.id)}
                type="link"
              >
                คอมเมนต์
              </Button>,
              user.id !== product.user.id ? (
                <Button
                  icon={<SwapOutlined />}
                  onClick={() => handleExchangeClick(product)}
                  type="link"
                >
                  เสนอแลก
                </Button>
              ) : (
                <Button
                  icon={<SwapOutlined />}
                  onClick={(e) => {
                    e.preventDefault();
                    alert('ไม่สามารถแลกกับสินค้าตัวเองได้!');
                  }}
                  type="link"
                  disabled
                >
                  แลกเปลี่ยน
                </Button>
              ),
            ]}
            extra={
              <Dropdown overlay={renderDropdownMenu(product)} trigger={['click']}>
                <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
              </Dropdown>
            }
          >
            <Card.Meta
              avatar={
                <Avatar
                  src={product.user?.profilePicture || '/default-profile.png'}
                  onClick={() => handleProfileClick(product.user.id)}
                  style={{ cursor: 'pointer' }}
                />
              }
              title={product.user.nickname}
              description={
                <>
                  <div>{new Date(product.createdAt).toLocaleString()}</div>
                  <div>
                    <Tag color={product.status === 'available' ? 'green' : 'red'}>
                      {product.status === 'available' ? 'พร้อมแลก' : 'แลกแล้ว'}
                    </Tag>
                  </div>
                  <div>ราคาประเมิน: {product.price} บาท</div>
                </>
              }
            />
          </Card>
        ))}

      {showOfferForm && selectedProduct && (
        <OfferForm 
          productId={selectedProduct.id} 
          fromUserId={user.id} 
          toUserId={selectedProduct.user.id} 
          onClose={handleCloseOfferForm} 
        />
      )}

      {showOffersDetail && (
        <OffersDetail 
          userId={user.id} 
          productId={user.productId}
          onClose={handleCloseOffersDetail} 
        />
      )}
    </div>
  );
};

export default ProductsSection;
