import os
import re
import boto3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Boto3 Session
session = boto3.Session(
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

pricing_client = session.client('bcm-pricing-calculator')
sts_client = session.client('sts')

# Get Account ID
try:
    ACCOUNT_ID = sts_client.get_caller_identity()["Account"]
    print(f"Connected to AWS Account: {ACCOUNT_ID}")
except Exception as e:
    print(f"Error: {e}")
    ACCOUNT_ID = None

class PricingRequest(BaseModel):
    project_name: str
    usage_type: str
    amount: float

def clean_name(name: str):
    name = name.replace(" ", "-")
    return re.sub(r'[^a-zA-Z0-9-]', '', name)

@app.post("/generate-estimate")
async def generate_estimate(data: PricingRequest):
    if not ACCOUNT_ID:
        return {"success": False, "error": "AWS Account ID missing"}

    try:
        safe_name = clean_name(data.project_name)

        # 1. Create Estimate
        estimate = pricing_client.create_workload_estimate(
            name=safe_name,
            rateType='BEFORE_DISCOUNTS'
        )
        est_id = estimate['id']

        # 2. Add Usage - FIXING THE KEY ERROR HERE
        pricing_client.batch_create_workload_estimate_usage(
            workloadEstimateId=est_id,
            usage=[{
                'key': 'item1',                    # ALPHANUMERIC ONLY, <= 10 CHARS
                'usageAccountId': ACCOUNT_ID,      
                'serviceCode': 'AmazonEC2',
                'usageType': data.usage_type,      
                'operation': 'RunInstances',
                'amount': data.amount,
                'group': 'ArchGroup'               # Shortened group name too
            }]
        )

        url = f"https://console.aws.amazon.com/billing/home#/fcm/estimates/{est_id}"
        return {"success": True, "url": url}

    except Exception as e:
        print(f"Full Error: {str(e)}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)