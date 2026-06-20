import httpx
import json

BASE_URL = "http://127.0.0.1:8000"

def run_test():
    print("Starting integration tests for Admin User Deletion...")
    
    # 1. Register Admin User
    admin_payload = {
        "email": "admin_test_delete@eduai.com",
        "name": "Test Admin",
        "password": "123@"
    }
    
    # Register normal User
    user_payload = {
        "email": "user_test_delete@eduai.com",
        "name": "Test User",
        "password": "password123"
    }

    client = httpx.Client()
    
    # Register users (might already exist, so ignore 400 error for already registered)
    r = client.post(f"{BASE_URL}/auth/register", json=admin_payload)
    print("Register Admin:", r.status_code, r.text[:100])
    
    r = client.post(f"{BASE_URL}/auth/register", json=user_payload)
    print("Register User:", r.status_code, r.text[:100])

    # 2. Login as Admin
    login_data = {
        "username": "admin_test_delete@eduai.com",
        "password": "123@"
    }
    r = client.post(f"{BASE_URL}/auth/login", data=login_data)
    if r.status_code != 200:
        print("Login failed:", r.status_code, r.text)
        return
        
    auth_data = r.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    admin_id = auth_data["user"]["id"]
    print(f"Logged in as admin successfully. Admin ID = {admin_id}")

    # 3. Get all users
    r = client.get(f"{BASE_URL}/admin/users", headers=headers)
    assert r.status_code == 200, f"Could not list users: {r.text}"
    users = r.json()
    
    target_user = None
    for u in users:
        if u["email"] == "user_test_delete@eduai.com":
            target_user = u
            break
            
    if not target_user:
        print("Target user not found in user list")
        return
        
    user_id = target_user["id"]
    print(f"Found target user: {target_user['email']} with ID: {user_id}")

    # 4. Delete the target user
    r = client.delete(f"{BASE_URL}/admin/users/{user_id}", headers=headers)
    print("Delete User response:", r.status_code, r.text)
    assert r.status_code == 200, f"Failed to delete user: {r.text}"

    # Verify user is deleted
    r = client.get(f"{BASE_URL}/admin/users", headers=headers)
    users = r.json()
    emails = [u["email"] for u in users]
    assert "user_test_delete@eduai.com" not in emails, "User was not deleted!"
    print("Verification passed: user was deleted from the system.")

    # 5. Try self deletion
    r = client.delete(f"{BASE_URL}/admin/users/{admin_id}", headers=headers)
    print("Self delete response:", r.status_code, r.text)
    assert r.status_code == 400, f"Self-deletion should fail with 400 but returned {r.status_code}"
    print("Verification passed: self-deletion guard is active and correct.")
    
    print("All tests completed successfully!")

if __name__ == "__main__":
    run_test()
