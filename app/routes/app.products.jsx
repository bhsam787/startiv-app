import {
  IndexTable,
  Page,
  Text,
  Select,
  Toast,
  Frame,
  Spinner,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query GetProducts {
      products(first: 10, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id
          title
          createdAt
          status
          variants(first: 1) {
            nodes {
              price
            }
          }
        }
      }
    }
  `);

  const data = await response.json();
  return { products: data.data.products.nodes };
};

export default function ProductTable() {
  const { products } = useLoaderData();

  const [statuses, setStatuses] = useState(() =>
    products.reduce((acc, product) => {
      acc[product.id] = product.status === "ACTIVE" ? "active" : "draft";
      return acc;
    }, {})
  );

  const [loadingIds, setLoadingIds] = useState(new Set());
  const [toast, setToast] = useState({ active: false, content: "" });

  const toggleToastActive = useCallback(() => {
    setToast((prev) => ({ ...prev, active: !prev.active }));
  }, []);

  const handleStatusChange = async (productId, newValue) => {
    setStatuses((prev) => ({
      ...prev,
      [productId]: newValue,
    }));
    setLoadingIds((prev) => new Set(prev).add(productId));

    try {
      const response = await fetch("/update-product-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          status: newValue.toUpperCase(),
        }),
      });

      const result = await response.json();

      if (result.data?.productUpdate?.userErrors?.length) {
        const messages = result.data.productUpdate.userErrors
          .map((e) => e.message)
          .join(", ");
        setToast({ active: true, content: `Error: ${messages}` });

        setStatuses((prev) => ({
          ...prev,
          [productId]: prev[productId] === "active" ? "draft" : "active",
        }));
      } else {
        setToast({ active: true, content: "Product status updated successfully!" });
      }
    } catch (error) {
      setToast({ active: true, content: "Mutation failed: " + error.message });
      setStatuses((prev) => ({
        ...prev,
        [productId]: prev[productId] === "active" ? "draft" : "active",
      }));
    } finally {
      setLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const options = [
    { label: "Draft", value: "draft" },
    { label: "Active", value: "active" },
  ];

  const rowMarkup = products.map((product, index) => (
    <IndexTable.Row id={product.id} key={product.id} position={index}>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {product.title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {product.variants.nodes[0]?.price
          ? `$${product.variants.nodes[0].price}`
          : "N/A"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(product.createdAt).toLocaleDateString()}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div style={{ width: "120px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Select
            options={options}
            onChange={(value) => handleStatusChange(product.id, value)}
            value={statuses[product.id]}
            disabled={loadingIds.has(product.id)}
          />
          {loadingIds.has(product.id) && <Spinner accessibilityLabel="Loading" size="small" />}
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Frame>
      <Page fullWidth>
        <TitleBar title="Latest Products" />
        <IndexTable
          selectable={false}
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={products.length}
          headings={[
            { title: "Title" },
            { title: "Price" },
            { title: "Published Date" },
            { title: "Status" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Page>
      {toast.active && (
        <Toast content={toast.content} onDismiss={toggleToastActive} />
      )}
    </Frame>
  );
}
