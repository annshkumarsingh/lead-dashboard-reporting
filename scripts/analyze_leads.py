import sys
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

if len(sys.argv) < 2:
    print("Usage: python scripts/analyze_leads.py path/to/leads-report.csv")
    raise SystemExit(1)

csv_path = Path(sys.argv[1])
if not csv_path.exists():
    print(f"File not found: {csv_path}")
    raise SystemExit(1)

output_dir = Path(__file__).parent / "output"
output_dir.mkdir(exist_ok=True)

df = pd.read_csv(csv_path)
print("
Lead Report Summary")
print("-------------------")
print(f"Total Leads: {len(df)}")

if "Status" in df.columns:
    print("
Status Breakdown:")
    print(df["Status"].value_counts())
    converted = (df["Status"] == "Converted").sum()
    print(f"
Conversion Rate: {(converted / len(df) * 100 if len(df) else 0):.2f}%")
    df["Status"].value_counts().plot(kind="bar", title="Status Breakdown")
    plt.tight_layout()
    plt.savefig(output_dir / "status_breakdown.png")
    plt.close()

if "City" in df.columns:
    print("
Top Cities:")
    print(df["City"].value_counts().head(10))
    df["City"].value_counts().head(10).plot(kind="bar", title="Top Cities")
    plt.tight_layout()
    plt.savefig(output_dir / "city_distribution.png")
    plt.close()

if "Service" in df.columns:
    print("
Top Services:")
    print(df["Service"].value_counts().head(10))
    df["Service"].value_counts().head(10).plot(kind="bar", title="Top Services")
    plt.tight_layout()
    plt.savefig(output_dir / "service_distribution.png")
    plt.close()

print(f"
Charts saved in: {output_dir}")
