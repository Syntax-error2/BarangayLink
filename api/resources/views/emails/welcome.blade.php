<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            color: #111827;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .content {
            padding: 20px 0;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome to BarangayLink</h2>
        </div>
        <div class="content">
            <p>Hi {{ $user->first_name }},</p>
            <p>Welcome to <strong>BarangayLink</strong>! Your account has been successfully created.</p>
            <p>You can now log into the mobile app to report issues, request services, and receive real-time updates from your local barangay.</p>
            <br>
            <p>Stay safe and connected,</p>
            <p>The BarangayLink Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} BarangayLink. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
