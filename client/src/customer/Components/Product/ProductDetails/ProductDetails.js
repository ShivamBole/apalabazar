import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import MobNavbar from "../../Navbar/MobileNavbar";
import Footer from "../../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../Redux/Product/productSlice"; 
import { useCartContext } from "../../../../Usecontext/cartContext";
import { StarIcon, ShoppingCartIcon } from "@heroicons/react/solid";
import Reviews from "../../ReviewProduct/RateProduct";
import "./ProductDetails.css"; // Import the improved CSS

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { productDetails, status, error } = useSelector((state) => state.products);
  const { addTocart } = useCartContext();

  const [tab, setTab] = useState("Reviews");
  const [viewport, setViewport] = useState(window.innerWidth < 620);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    const handleResize = () => setViewport(window.innerWidth < 620);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="lg:block">
        {viewport ? <MobNavbar /> : <Navbar number={12} />}
      </div>
      <div className="product-details-container">
        <div className="product-image-section">
          <Slider {...settings}>
            <img
              src={productDetails?.imageUrl} 
              alt="Product Image"
              className="product-image"
            />
          </Slider>
        </div>
        <div className="product-info-section">
          <h1 className="product-title">{productDetails?.title}</h1>
          <div className="product-rating">
            {[...Array(5)].map((star, index) => (
              <StarIcon
                key={index}
                className={`star-icon ${index < productDetails?.rating ? "filled" : ""}`}
              />
            ))}
            <span className="rating-text">
              {productDetails?.numRatings || 0} Ratings
            </span>
          </div>
          <div className="product-pricing">
            <span className="discounted-price">
              ₹{productDetails?.discountedPrice}
            </span>
            <span className="original-price">
              ₹{productDetails?.price}
            </span>
          </div>
          <div className="stock-status">In Stock</div>
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max="10"
              defaultValue="1"
            />
          </div>
          <div className="button-group">
            <button
              className="add-to-cart-btn"
              onClick={() => addTocart(productDetails)}
            >
              <ShoppingCartIcon className="cart-icon" /> Add to Cart
            </button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
          <div className="product-description">
            <h2 className="tab-title">Description</h2>
            <div className="description-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: productDetails?.description,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <nav className="tabs-navigation">
        <ul
          onClick={() => setTab("Reviews")}
          className={`tab-item ${tab === "Reviews" ? "active" : ""}`}
        >
          Reviews
        </ul>
        <ul
          onClick={() => setTab("Country of Origin")}
          className={`tab-item ${tab === "Country of Origin" ? "active" : ""}`}
        >
          Country of Origin
        </ul>
        <ul
          onClick={() => setTab("Disclaimer")}
          className={`tab-item ${tab === "Disclaimer" ? "active" : ""}`}
        >
          Disclaimer
        </ul>
      </nav>
      <div className="tab-content">
        {tab === "Disclaimer" && (
          <div className="disclaimer-content">
            <h2 className="section-title">Apala Bazaar Terms of Use</h2>
            <div className="text-content">
              <p className="paragraph">
                This document is an electronic record in terms of Information Technology Act, 2000 and rules there under as applicable and the amended provisions pertaining to electronic records in various statutes as amended by the Information Technology Act, 2000. This electronic record is generated by a computer system and does not require any physical or digital signatures.
              </p>
              <p className="paragraph">
                Your use of the Website and services and tools are governed by the following terms and conditions ("Terms of Use") as applicable to the Website including the applicable policies which are incorporated herein by way of reference. If You transact on the Website, You shall be subject to the policies that are applicable to the Website for such transaction. By mere use of the Website, You shall be contracting with Apala Bazar and these terms and conditions including the policies constitute Your binding obligations, with Apala Bazar.
              </p>
              <p className="paragraph">
                For the purpose of these Terms of Use, wherever the context so requires "You" or "User" shall mean any natural or legal person who has agreed to become a buyer on the Website by providing Registration Data while registering on the Website as Registered User using the computer systems. Apala Bazar allows the User to surf the Website or make purchases without registering on the Website. The term "We", "Us", "Our" shall mean Apala Bazar.
              </p>
              <p className="paragraph">
                When You use any of the services provided by Us through the Website, including but not limited to, (e.g. Product Reviews, Seller Reviews), You will be subject to the rules, guidelines, policies, terms, and conditions applicable to such service, and they shall be deemed to be incorporated into this Terms of Use and shall be considered as part and parcel of this Terms of Use. We reserve the right, at Our sole discretion, to change, modify, add or remove portions of these Terms of Use, at any time without any prior written notice to You. It is Your responsibility to review these Terms of Use periodically for updates / changes. Your continued use of the Website following the posting of changes will mean that You accept and agree to the revisions. As long as You comply with these Terms of Use, We grant You a personal, non-exclusive, non-transferable, limited privilege to enter and use the Website.
              </p>
              <p className="warning-text">
                Accessing, browsing or otherwise using the site indicates your agreement to all the terms and conditions under these terms of use, so please read the terms of use carefully before proceeding.
              </p>
              <p className="mt-12 text-content">
                While we work to ensure that the product information is correct, actual product packaging and material may contain more or different information from what is given here. Please read the product labels, description, directions, warning and other information that comes with the actual product before use.
              </p>
            </div>
          </div>
        )}
        {tab === "Country of Origin" && (
          <div className="country-origin-content">
            <p className="text-gray-700 flex items-center mb-2">
              <span className="ml-1 font-semibold">Made in India</span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> Apala Bazar Panchayat Samiti Road, Shrigonda-413701, Ahmednagar, Maharashtra
            </p>
          </div>
        )}
        {tab === "Reviews" && <Reviews />}
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
