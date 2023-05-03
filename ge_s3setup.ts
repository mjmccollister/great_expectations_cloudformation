Parameters:
  BucketName:
    Type: String
    Description: Name of the S3 bucket
  RoleName:
    Type: String
    Description: Name of the IAM role for the S3 bucket
    Default: S3BucketAccessRole
  Environment:
    Type: String
    Description: Environment name
    Default: dev

Resources:
  MyS3Bucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      BucketName: !Ref BucketName
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: Owner
          Value: CloudFormation
  MyS3Role:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: !Ref RoleName
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: s3.amazonaws.com
            Action: 'sts:AssumeRole'
      Policies:
        - PolicyName: S3AccessPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - 's3:GetObject'
                  - 's3:PutObject'
                  - 's3:DeleteObject'
                  - 's3:ListBucket'
                  - 's3:PutBucketVersioning'
                Resource:
                  - !Join ['', ['arn:aws:s3:::', !Ref BucketName]]
                  - !Join ['', ['arn:aws:s3:::', !Ref BucketName, '/*']]
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: Owner
          Value: CloudFormation
