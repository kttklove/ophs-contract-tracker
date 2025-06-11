import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { supabase } from "@/supabaseClient.js";
import styles from "../src/styles/App.module.css"; // From pages/ to src/styles/

function ContractCard({ contract }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.contractCard}>
      <h2>{contract.vendor}</h2>
      <p>
        <strong>Contract #:</strong> {contract.contract_number}
      </p>
      <p>
        <strong>Term:</strong> {contract.term} ({contract.start_year}–
        {contract.end_year})
      </p>
      <p>
        <strong>Amount:</strong> ${contract.total_value_clean?.toLocaleString()}
      </p>
      <p>
        <strong>Category:</strong> {contract.contract_category}
      </p>
      <p>
        <strong>Red Flags:</strong>{" "}
        {contract.red_flags && contract.red_flags.length > 0
          ? contract.red_flags.join(", ")
          : "None"}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className={styles.toggleButton}
        aria-label={
          expanded
            ? `Hide details for ${contract.contract_number}`
            : `Show details for ${contract.contract_number}`
        }
      >
        {expanded ? "Hide Details" : "Show More"}
      </button>
      {expanded && (
        <div className={styles.details}>
          <p>
            <strong>Purpose:</strong>
            <br />
            <span>{contract.purpose || "—"}</span>
          </p>
          <p>
            <strong>Accountability Questions:</strong>
            <br />
            <span>{contract.accountability_questions || "—"}</span>
          </p>
          <p>
            <strong>Amendments Summary:</strong>
            <br />
            <span>{contract.amendments_summary || "—"}</span>
          </p>
          <p>
            <strong>Equity / Trauma Notes:</strong>
            <br />
            <span>{contract.trauma_equity_notes || "—"}</span>
          </p>
          <p>
            <strong>Funding Source:</strong>
            <br />
            <span>{contract.funding_source || "—"}</span>
          </p>
          {contract.testimony_link && (
            <p>
              <a
                href={contract.testimony_link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                🔗 View Related Testimony
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFlag, setSelectedFlag] = useState("All");
  const [sortAscending, setSortAscending] = useState(false);

  useEffect(() => {
    async function fetchContracts() {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("total_value_clean", { ascending: false });

      if (error) {
        console.error("Error fetching contracts:", error);
      } else {
        console.log("Fetched contracts:", data); // Debug
        setContracts(data);
      }
    }
    fetchContracts();
  }, []);

  const filteredContracts = contracts
    .filter((contract) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        contract.vendor?.toLowerCase().includes(term) ||
        contract.purpose?.toLowerCase().includes(term) ||
        contract.contract_category?.toLowerCase().includes(term) ||
        contract.accountability_questions?.toLowerCase().includes(term) ||
        contract.amendments_summary?.toLowerCase().includes(term) ||
        contract.trauma_equity_notes?.toLowerCase().includes(term) ||
        contract.funding_source?.toLowerCase().includes(term) ||
        (contract.red_flags || []).join(", ").toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All" ||
        contract.contract_category === selectedCategory;

      const matchesFlag =
        selectedFlag === "All" ||
        (contract.red_flags || []).includes(selectedFlag);

      return matchesSearch && matchesCategory && matchesFlag;
    })
    .sort((a, b) => {
      const aVal = a.total_value_clean || 0;
      const bVal = b.total_value_clean || 0;
      return sortAscending ? aVal - bVal : bVal - aVal;
    });

  return (
    <>
      <Head>
        <title>OPHS Contract Tracker - Allies for Humanity</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/logo.png" // Add logo to public/
            alt="Allies for Humanity Logo"
            width={150}
            height={50}
            priority
          />
        </div>
        <nav>
          <ul className={styles.navList}>
            <li>
              <a href="https://www.alliesforhumanity.org/">Home</a>
            </li>
            <li>
              <a href="https://www.alliesforhumanity.org/about">About</a>
            </li>
            <li>
              <a href="https://www.alliesforhumanity.org/contact">Contact</a>
            </li>
            <li>
              <a href="#" className={styles.active}>
                Contract Tracker
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.container}>
        <section className={styles.hero}>
          <h1>🧾 OPHS Contract Explorer</h1>
          <p>
            Track and manage contracts efficiently, in partnership with Allies
            for Humanity’s mission to foster collaboration.
          </p>
        </section>
        <div className={styles.controls}>
          <input
            type="text"
            id="searchInput"
            name="search"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.input}
            aria-label="Search contracts"
          />
          <div>
            <label htmlFor="categoryFilter" className={styles.label}>
              Filter by Category:
            </label>
            <select
              id="categoryFilter"
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
              aria-label="Filter by category"
            >
              <option value="All">All</option>
              <option value="Housing">Housing</option>
              <option value="Legal Aid">Legal Aid</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Violence Prevention">Violence Prevention</option>
              <option value="Training">Training</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="flagFilter" className={styles.label}>
              Filter by Red Flag:
            </label>
            <select
              id="flagFilter"
              name="redFlag"
              value={selectedFlag}
              onChange={(e) => setSelectedFlag(e.target.value)}
              className={styles.select}
              aria-label="Filter by red flag"
            >
              <option value="All">All</option>
              <option value="Conditional Care">Conditional Care</option>
              <option value="Trauma-Indifferent">Trauma-Indifferent</option>
              <option value="No Oversight">No Oversight</option>
              <option value="No Community Input">No Community Input</option>
            </select>
          </div>
          <button
            onClick={() => setSortAscending(!sortAscending)}
            className={styles.sortButton}
            aria-label={`Sort by amount ${
              sortAscending ? "low to high" : "high to low"
            }`}
          >
            Sort by Amount: {sortAscending ? "Low → High" : "High → Low"}
          </button>
        </div>
        {filteredContracts.length > 0 ? (
          filteredContracts.map((contract) => (
            <ContractCard key={contract.contract_number} contract={contract} />
          ))
        ) : (
          <p>No contracts found.</p>
        )}
      </main>
      <footer className={styles.footer}>
        <p>
          © 2025 Allies for Humanity. <a href="#">Privacy</a> |{" "}
          <a href="#">Terms</a> |{" "}
          <a href="https://www.alliesforhumanity.org/contact">Contact Us</a>
        </p>
      </footer>
    </>
  );
}
