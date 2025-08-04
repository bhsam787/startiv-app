import {
  IndexTable,
  Page,
  useIndexResourceState,
  Text,
  Select,
} from "@shopify/polaris";
import React from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
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
    }`,
  );

  const data = await response.json();

  return { products: data.data.products.nodes };
};

export default function ProductTable() {
  const { products } = useLoaderData();

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  const options = [
    { label: "Inactive", value: "inactive" },
    { label: "Active", value: "active" },
  ];

  const rowMarkup = products.map((product, index) => (
    <IndexTable.Row
      id={product.id}
      key={product.id}
      selected={selectedResources.includes(product.id)}
      position={index}
    >
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
        <div style={{ width: "120px" }}>
          <Select
            options={options}
            value={product.status == "ACTIVE" ? "active" : "inactive"}
          />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page fullWidth>
      <TitleBar title="Latest Products" />

      <IndexTable
        resourceName={resourceName}
        itemCount={products.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
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
  );
}
